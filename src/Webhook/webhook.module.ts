import {Module} from "@nestjs/common";
import {WebhookController} from "./webhook.controller";
import {TransactionModule} from "../Transaction/transaction.module";
import {BankModule} from "../Bank/bank.module";
import {TransactionCategoryModule} from "../TransactionCategory/category.module";

@Module({
    imports:[
        TransactionModule,
        BankModule,
        TransactionCategoryModule
    ],
    providers: [],
    controllers: [WebhookController],
    exports:[]
})
export class WebhookModule {}
