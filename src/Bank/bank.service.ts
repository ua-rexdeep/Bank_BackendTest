import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOptionsWhere, Repository} from 'typeorm';
import {Bank} from './bank.entity';
import {TransactionService} from "../Transaction/transaction.service";
import {TransactionType} from "../Transaction/transactionType.enum";

@Injectable()
export class BankService {
    constructor(
        @InjectRepository(Bank)
        private bankRepository: Repository<Bank>,
        private transactionService: TransactionService,
    ) {}

    async findAll(): Promise<Bank[]> {
        const banks = await this.bankRepository.find();
        for (const bank of banks) {
            bank.balance = await this.getBalance(bank)
        }
        return banks;
    }

    async getBalance(bank: Bank): Promise<number> {
        const trans = await this.transactionService.find({ where: { bank: bank.id } })
        let balance: number = bank.balance;
        trans.forEach(t => {
            switch(t.type) {
                case TransactionType.PROFITABLE:
                    balance += t.amount; break;
                case TransactionType.CONSUMABLE:
                    balance -= t.amount; break;
            }
        })
        return balance
    }

    async findOne(rule: FindOptionsWhere<Bank>): Promise<Bank> {
        const bank = await this.bankRepository.findOneBy(rule);
        if(bank) bank.balance = await this.getBalance(bank)
        return bank;
    }

    async delete(id: number): Promise<{solved: boolean, message?: string}> {
        const bank = await this.findOne({ id })
        if(!bank) return { solved: false, message: 'bank not found' };

        const transactions = await this.transactionService.countOf({ where: { bank: id } })
        if(transactions !== 0) return { solved: false, message: 'bank has transactions' };

        await this.bankRepository.delete(id);
        return { solved: true };
    }

    async edit(id:number, data: Bank): Promise<Bank | any> {
        const bank: Bank = await this.findOne({ id })
        if(!bank) return `bank(${id}) not found`
        bank.name = data.name || bank.name;
        bank.balance = data.balance || bank.balance;
        try {
            await this.bankRepository.save(bank)
        } catch(e) {
            console.error(e.driverError)
            return {
                name: e.driverError.name,
                severity: e.driverError.severity,
                detail: e.driverError.detail
            }
        }
        return bank;
    }

    async create(data: Bank): Promise<Bank | any> {
        const bank = this.bankRepository.create(data)
        try {
            await this.bankRepository.save(bank)
        } catch(e) {
            console.error(e.driverError)
            return {
                name: e.driverError.name,
                severity: e.driverError.severity,
                detail: e.driverError.detail
            }
        }
        return bank
    }
}
