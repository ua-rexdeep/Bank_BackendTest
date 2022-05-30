import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, FindOptionsWhere, Repository} from "typeorm";
import {Category} from "./category.entity";
import {Bank} from "../Bank/bank.entity";

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    findAll(rule?: FindManyOptions){
        return this.categoryRepository.find(rule)
    }

    async findOne(rule: FindOptionsWhere<Category>): Promise<Category> {
        return this.categoryRepository.findOne({ where: rule, relations: ['transactions'] });
    }

    async create(data: Category): Promise<Bank | any> {
        const category: Category = this.categoryRepository.create(data);
        try {
            await this.categoryRepository.save(category)
        } catch(e) {
            console.error(e.driverError)
            return {
                name: e.driverError.name,
                severity: e.driverError.severity,
                detail: e.driverError.detail
            }
        }
        return category;
    }

    async delete(id: string): Promise<{solved: boolean, message?: string}> {
        const category = await this.findOne({ id })
        console.log(category)
        if(!category) return { solved: false, message: 'category not found' };

        if(category.transactions.length !== 0) return { solved: false, message: 'category has transactions' };

        // await this.categoryRepository.delete(id);
        return { solved: true };
    }

    async update(id: string, body: Category){
        const category = await this.findOne({ id })
        if(!category) return 'category not found';
        category.name = body.name || category.name;

        try {
            await this.categoryRepository.save(category)
        } catch(e) {
            console.error(e.driverError)
            return {
                name: e.driverError.name,
                severity: e.driverError.severity,
                detail: e.driverError.detail
            }
        }

        return category;
    }
}
