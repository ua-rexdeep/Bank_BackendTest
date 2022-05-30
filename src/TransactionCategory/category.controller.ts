import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query} from "@nestjs/common";
import {CategoryService} from "./category.service";
import {Category} from "./category.entity";
import {constants} from "http2";

@ApiTags('Transaction Category')
@Controller('/categories')
export class CategoryController {
    constructor(private categoryService:CategoryService){}

    @Get()
    @ApiOperation({ summary: 'Find all transaction categories' })
    @ApiResponse({
        status: 200,
        isArray: true,
        type: Category
    })
    findAll(){
        return this.categoryService.findAll()
    }

    @Post()
    @ApiOperation({ summary: `Create transaction category` })
    @ApiResponse({
        status: HttpStatus.CREATED,
        type: Category
    })
    create(@Query() query: Category) {
        return this.categoryService.create(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find transaction category by id' })
    @ApiResponse({
        status: 200,
        type: Category
    })
    findOne(@Param('id') id: string){
        return this.categoryService.findOne({ id })
    }

    @Delete(':id')
    @ApiOperation({ summary: `Delete category if there are no transactions` })
    delete(@Param('id') id: string) {
        return this.categoryService.delete(id)
    }

    @Patch(':id')
    @ApiOperation({ summary: `Edit category by ID` })
    edit(@Param("id") id: string, @Query() query: Category) {
        return this.categoryService.update(id, query)
    }
}
