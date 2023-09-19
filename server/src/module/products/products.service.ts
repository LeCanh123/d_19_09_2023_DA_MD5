import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';



//orm
import {  Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryFailedError } from 'typeorm';


@Injectable()

export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
  ) {}

  
  async create(createProductDto: CreateProductDto){
    try{
      const newProduct = await this.productRepository.save(createProductDto);

      console.log("newProductnewProductnewProduct",newProduct);
      
      return {
        status:true,
        message:"Tạo Product Thành công"
      }
    }
    catch(error){
      console.log("newProductnewProductnewProduct",error);
      if (error instanceof QueryFailedError) {
        // Xử lý lỗi QueryFailedError
        console.error('Query failed:', error.message);
        if(error.message.toString().includes("foreign key")||error.message.toString().includes("Data too long")){{
          return {
            status:false,
            message:"Category Id không đúng"
          }
        }}else{
          return {
            status:false,
            message:"Tạo Product Thất bại"
          }
        }
    } else {
      return {
        status:false,
        message:"Tạo Product Thất bại"
      }
    }
     
    }
  }


  async findByPage(skip,take) {
    // console.log("skip là",skip);
    // console.log("take là",take);
    try{
      const [products, total] = await this.productRepository.findAndCount({
        skip,
        take,
      });
      
      console.log("total",total);
      

      return this.productRepository.find({skip,take});
    }
    catch(err){
    return {
      status:false,
    message:"Lấy Danh Sách Product findByPage không thành công"
    }
    }

    // return this.productRepository.find();
  }

  async findAll() {
      try{
        let findAllResult= await this.productRepository.find();
       
        return  {
          status:true,
          message:"Lấy Danh Sách Product FindAll Thành công",
          data:findAllResult
        }
        

      }
      catch(err){
        return  {
          status:false,
          message:"Lấy Danh Sách Product FindAll Thất Bại"

        }
      }


    
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
