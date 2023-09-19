import { Controller, Get, Post, Body, Patch, Param, Delete, Version, ParseIntPipe, Query, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateAdminCheckLoginDto } from './dto/admin-checklogin.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import * as path from 'path';
import * as fs from 'fs';




@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}




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

  //Admin
  @Post("admin/checklogin")
  adminCheckLogin(@Body() createAdminCheckLoginDto: CreateAdminCheckLoginDto) {
    return this.productsService.adminCheckToken(createAdminCheckLoginDto);
  }

  @Post()
  // @UseInterceptors(FilesInterceptor('image'))
  // @UseInterceptors(FilesInterceptor('image'))
  create(@Body() createProductDto: CreateProductDto,@UploadedFiles() image: Array<Express.Multer.File>) {
    console.log("CreateProductDto.username",createProductDto);
    console.log("image",image);
    
    try{
      let createProductResult= this.productsService.create(createProductDto);
      console.log("createProductResult",createProductResult);
      const originalFileName = image[0].originalname;
      const fileExtension = path.extname(originalFileName); // Trích xuất đuôi tệp tin
      const uploadedFilePath = image[0].path;
      const newFilePath = uploadedFilePath + fileExtension; // Đường dẫn mới với đuôi tệp tin đúng
      fs.renameSync(uploadedFilePath, newFilePath); // Đổi tên tệp tin

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




}
