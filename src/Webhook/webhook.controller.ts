import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Headers, ParseUUIDPipe} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {BankService} from "../Bank/bank.service";
import {TransactionService} from "../Transaction/transaction.service";
import {CategoryService} from "../TransactionCategory/category.service";
import {TransactionType} from "../Transaction/transactionType.enum";

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
    constructor(
        private transactionService: TransactionService,
        private bankService: BankService,
        private categoryService: CategoryService){}

    @Post(':hook_id')
    @ApiOperation({ summary: `Add transaction` })
    async createOrder(
        @Body() data,
        @Param('hook_id', ParseUUIDPipe) id: number,
        @Headers('authorization') bearer: string) {
        const token: string = bearer?.split(' ')[1];
        if(!token) return 'authorization header required';

        const bank = await this.bankService.findOne({ api_key: token })
        if(!bank) return 'invalid authorization token'

        if(!Object.values(TransactionType).includes(data.type)) return 'invalid transaction type. allowed: '+Object.values(TransactionType).join(', ')

        try { data.categories = JSON.parse(data.categories) }
        catch(e) { data.categories = [] }

        const transaction = await this.transactionService.create(data)

        return transaction.id ? 'ok' : transaction;
    }
}
