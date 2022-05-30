import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {Bank} from "./Bank/bank.entity";
import {BankModule} from "./Bank/bank.module";

import {Transaction} from './Transaction/transaction.entity'
import {TransactionModule} from "./Transaction/transaction.module";

import {WebhookModule} from "./Webhook/webhook.module";

import {Category} from "./TransactionCategory/category.entity";
import {TransactionCategoryModule} from "./TransactionCategory/category.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'rexdeep',
            database: 'postgres',
            entities: [
                Bank,
                Transaction,
                Category
            ],
            synchronize: true,
        }),
        BankModule,
        TransactionModule,
        WebhookModule,
        TransactionCategoryModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
