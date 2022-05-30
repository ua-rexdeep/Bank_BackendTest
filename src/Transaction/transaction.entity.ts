import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, Generated, CreateDateColumn,} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Bank} from "../Bank/bank.entity";
import {TransactionType} from "./transactionType.enum";
import {Category} from "../TransactionCategory/category.entity";

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'ID generated automatically' })
    id: number;

    @Column({type: 'float', default: 0})
    @ApiProperty({ example: 172.27344, description: 'Transaction amount' })
    amount: number;

    @Column({type: "enum", enum: TransactionType, nullable: false})
    @ApiProperty({ example: 'consumable', description: 'Transaction type: profitable or consumable' })
    type: TransactionType

    @Column({ type: "int" })
    @ApiProperty({ example: 1, description: 'Transaction bank id' })
    @ManyToOne(() => Bank, bank => bank.id)
    @JoinColumn()
    bank: number

    @ApiProperty({ example: [Category], description: 'Transaction type: profitable or consumable', required: false })
    @ManyToMany((type) => Category, c => c.transactions)
    @JoinTable()
    categories: Category[]

    @CreateDateColumn()
    created_at: Date
}
