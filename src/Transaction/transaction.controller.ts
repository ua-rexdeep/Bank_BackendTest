import {Controller, Get, Param, ParseIntPipe, Patch, Query} from '@nestjs/common';
import {TransactionService} from "./transaction.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {BankService} from "../Bank/bank.service";
import {Transaction} from "./transaction.entity";

@ApiTags('Transaction')
@Controller('bank/:id/transactions')
export class TransactionController {
    constructor(
        private transactionService: TransactionService,
        private bankService: BankService){}

    @Get()
    @ApiOperation({ summary: `Find all transactions in bank` })
    @ApiResponse({
        status: 200,
        type: Transaction,
        isArray: true
    })
    async getAll(@Param('id', ParseIntPipe) id: number, @Query() query){
        const per_page = query.per_page || 10;
        const page = (query.page ?? 1) ^ 0;
        const rule = { where: { bank: id }, skip: per_page*(page-1), take: per_page };
        const total = await this.transactionService.countOf(rule);
        // console.log((await this.transactionService.find(rule)).map(e=>e.categories))
        return {
            total,
            current_page: page,
            per_page,
            last_page: Math.ceil(total / per_page),
            data: await this.transactionService.find(rule),
        }
    }

    // @Patch(':transaction')
    // @ApiOperation({ summary: `Edit transaction by id` })
    // @ApiResponse({
    //     status: 200,
    //     type: Transaction
    // })
    // async edit(
    //     @Param('id', ParseIntPipe) bank: number,
    //     @Param('transaction', ParseIntPipe) transaction: number,
    //     @Query() query: Transaction){
    //     return this.transactionService.update(transaction, query)
    // }
}
