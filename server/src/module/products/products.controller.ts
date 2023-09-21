import { Controller, Get, Post, Body, Patch, Param, Delete, Version, ParseIntPipe, Query, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateAdminCheckLoginDto } from './dto/admin-checklogin.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import * as path from 'path';
import * as fs from 'fs';
import { uploadFileToStorage } from 'src/meobase';



@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}




  // @Version('2')
  @Get("findall")
  async findAll() {
    try{
      let findAllResult=await this.productsService.findAll();
      console.log("findAllResult",findAllResult);
      
          return findAllResult
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
  async create(@Body() createProductDto: CreateProductDto,@UploadedFiles() image: Array<Express.Multer.File>) {
    console.log("CreateProductDto.username",createProductDto);
    console.log("image",image);
    
    try{

      const originalFileName = image[0].originalname;
      const fileExtension = path.extname(originalFileName); // Trích xuất đuôi tệp tin
      const uploadedFilePath = image[0].path;
      const newFilePath = uploadedFilePath + fileExtension; // Đường dẫn mới với đuôi tệp tin đúng
      console.log("newFilePath",newFilePath);
      
      fs.renameSync(uploadedFilePath, newFilePath); // Đổi tên tệp tin

      //upload
      let avatarProcess;
      if(image){
        avatarProcess = await uploadFileToStorage(image[0], "products", fs.readFileSync(newFilePath));
       }
      console.log("đường dẫn firebase",avatarProcess);
      //xoá sau khi upload
      fs.unlinkSync(newFilePath);

      let createProductResult=await this.productsService.create({...createProductDto,image:avatarProcess});
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




}
