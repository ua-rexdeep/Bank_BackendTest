import {Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query,} from '@nestjs/common';
import {BankService} from "./bank.service";
import {Bank} from "./bank.entity";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TransactionService} from "../Transaction/transaction.service";
import {Between,In} from "typeorm";
import {Transaction} from "../Transaction/transaction.entity";
import {CategoryService} from "../TransactionCategory/category.service";

@ApiTags('Bank')
@Controller('bank')
export class BankController {
    constructor(
        private bankService:BankService,
        private transactionService: TransactionService,
        private categoryService: CategoryService){}

    @Get('all')
    @ApiOperation({ summary: `Find all banks` })
    async findAll() {
        return (await this.bankService.findAll()).map(bank => {
            delete bank.api_key
            delete bank.api_link
            return bank;
        })
    }

    @Get(':id')
    @ApiOperation({ summary: `Find bank from ID` })
    @ApiResponse({
        status: 200,
        description: 'Found bank',
        type: Bank
    })
    async findOne(@Param('id', ParseIntPipe) id: any) {
        const bank = await this.bankService.findOne({ id });
        if(bank) {
            delete bank.api_key
            delete bank.api_link
        }
        return bank || { found: false }
    }

    @Post()
    @ApiOperation({ summary: `Create bank` })
    @ApiResponse({
        status: 200,
        description: 'Bank created',
        type: Bank
    })
    create(@Query() body: Bank) {
        console.log(body)
        if(!!body.id) return 'field id cannot be set'
        if(!body.name) return 'field name required'
        return this.bankService.create(body)
    }

    @Patch(':id')
    @ApiOperation({ summary: `Edit bank by id` })
    @ApiBearerAuth()
    edit(@Query() body: Bank, @Param('id', ParseIntPipe) id: number) {
        if(id !== body.id) return 'id not equal'
        return this.bankService.edit(id, body)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete the bank if there are no transactions' })
    delete(@Param('id', ParseIntPipe) id: number){
        return this.bankService.delete(id);
    }

    @Get(':id/stats')
    @ApiOperation({ summary: `Statistics` })
    stats(@Param('id', ParseIntPipe) id: number, @Query() query: any){
        try { query.categoryIds = JSON.parse(query.categoryIds); }
        catch(e) { return 'categoryIds must be array 1' }

        if(!Array.isArray(query.categoryIds)) return 'categoryIds must be array 2'

        return this.transactionService.findAllByCategories(query.categoryIds,
            !isNaN(query.fromPeriod) ? new Date(+query.fromPeriod) : null,
            !isNaN(query.toPeriod) ? new Date(+query.toPeriod) : null)
    }
}
