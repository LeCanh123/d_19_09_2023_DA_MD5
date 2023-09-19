import { Controller, Get, Post, Body, Patch, Param, Delete, Version, ParseIntPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    console.log("CreateProductDto.username",createProductDto.title);
    try{
      let createProductResult= this.productsService.create(createProductDto);
      console.log("createProductResult",createProductResult);
      
      return createProductResult;
    }
    catch(err){
      return {
        status:false,
        message:"Tạo Product Thất bại"
      }
    }

    // return createProductDto.name

  }

  // @Version('2')
  @Get("findall")
  findAll() {
    try{
          return this.productsService.findAll();
    }
    catch(err){
      return {
        status:false,
        message:"Lấy Danh Sách Product Thất bại"
      }
    }

   
  }
  @Get("findbypage")
  findByPage(@Query('skip', ParseIntPipe) skip: number, @Query('take', ParseIntPipe) take: number) {
    try{
        if(skip&&take){
          return this.productsService.findByPage(skip,take);
          
        }else{
          return this.productsService.findAll();
        }
    }
    catch(err){
      return {
        status:false,
        message:"Lấy Danh Sách Product Thất bại"
      }
    }

   
  }

  @Version('1')
  @Get(':id')
  findOne(@Param('id' ,ParseIntPipe) id: number) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
