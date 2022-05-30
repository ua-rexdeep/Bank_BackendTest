import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import {Transaction} from "../Transaction/transaction.entity";

@Entity()
export class Category {
    @PrimaryColumn({ nullable: false })
    id: string;

    @Column()
    name: string;


    @ManyToMany((type) => Transaction, t => t.categories)
    @JoinTable()
    transactions: Transaction[]
}
