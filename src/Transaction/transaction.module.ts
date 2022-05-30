import {forwardRef, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Transaction} from "./transaction.entity";
import {TransactionService} from "./transaction.service";
import {TransactionController} from "./transaction.controller";
import {BankModule} from "../Bank/bank.module";
import {CategoryService} from "../TransactionCategory/category.service";
import {TransactionCategoryModule} from "../TransactionCategory/category.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([Transaction]),
        forwardRef(() => BankModule),
        TransactionCategoryModule
    ],
    providers: [TransactionService],
    controllers: [TransactionController],
    exports:[TransactionService]
})
export class TransactionModule {}
