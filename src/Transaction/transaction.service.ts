import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Between, FindManyOptions, Repository, MoreThanOrEqual, LessThanOrEqual} from "typeorm";
import {Transaction} from "./transaction.entity";
import {CategoryService} from "../TransactionCategory/category.service";

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private categoryService: CategoryService
    ) {}

    async create(data: Transaction): Promise<Transaction | any>{
        const categories = []
        for(const id of (data.categories as Array<any>)) {
            categories.push(await this.categoryService.findOne({ id }))
        }
        data.categories = categories;
        const trans = this.transactionRepository.create(data)

        try {
            await this.transactionRepository.save(trans)
        } catch(e) {
            console.error(e)
            return {
                name: e.driverError.name,
                severity: e.driverError.severity,
                detail: e.driverError.detail
            }
        }
        return trans
    }

    async find(rule: FindManyOptions<Transaction>){
        return this.transactionRepository.find({ ...rule, relations: ['categories'] })
    }

    async findOne(rule: FindManyOptions<Transaction>){
        return this.transactionRepository.findOne({ ...rule, relations: ['categories'] })
    }

    countOf(rule: FindManyOptions): Promise<number> {
        return this.transactionRepository.count(rule)
    }

    async findAllByCategories(categories: Array<string>, fromPeriod?: Date, toPeriod?: Date) {
        const res = {}
        const data = await this.find({
            relations: ['categories'],
            where: {
                categories: categories.map(x=> ({ id: x }) ),
                created_at: (fromPeriod && toPeriod && Between(fromPeriod, toPeriod)) ||
                    fromPeriod && MoreThanOrEqual(fromPeriod) || toPeriod && LessThanOrEqual(toPeriod)
            }
        })
        data.forEach(transaction => {
            if(!res[transaction.categories.map(c=>c.name).join(', ')]) res[transaction.categories.map(c=>c.name).join(', ')] = 0
            res[transaction.categories.map(c=>c.name).join(', ')] += transaction.amount
        })
        return res
    }

    // async update(id: number, body: Transaction) {
    //     const obj = await this.findOne({ where: { id } })
    //
    //     obj.amount = body.amount || obj.amount;
    //     obj.type = body.type || obj.type;
    //
    //     try {
    //         await this.transactionRepository.save(obj)
    //     } catch(e) {
    //         console.error(e)
    //         return {
    //             name: e.driverError.name,
    //             severity: e.driverError.severity,
    //             detail: e.driverError.detail
    //         }
    //     }
    //     return obj
    // }

}
