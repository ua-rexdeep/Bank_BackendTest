import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Bank} from "./bank.entity";
import {BankService} from "./bank.service";
import {BankController} from "./bank.controller";
import {TransactionModule} from "../Transaction/transaction.module";
import {TransactionService} from "../Transaction/transaction.service";
import {TransactionCategoryModule} from "../TransactionCategory/category.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([Bank]),
        TransactionModule,
        TransactionCategoryModule
    ],
    providers: [BankService],
    controllers: [BankController],
    exports:[BankService]
})
export class BankModule {}
