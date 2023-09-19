import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';



//orm
import {  Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryFailedError } from 'typeorm';
import { CreateAdminCheckLoginDto } from './dto/admin-checklogin.dto';
import jwt from 'src/services/jwt';
import { ProductImage } from '../productimages/entities/productimage.entity';


@Injectable()

export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
    @Inject('PRODUCT_REPOSITORY')
    private productImageRepository: Repository<ProductImage>,

  ) {}

  
  async create(createProductDto: CreateProductDto){
    try {
      //dữ liệu mẫu
    
      let data1:any={
        title:createProductDto.title,
        price:createProductDto.price,
        actualprice:createProductDto.actualprice,
        category:createProductDto.categoryId,
        block:"null"
      }

    
      const categorys=await this.productRepository.save(data1);
console.log("categorys",categorys);


      let data2:any={
        image:String(createProductDto.image),
        img1:String(createProductDto.img1),
        img2:String(createProductDto.img2),
        img3:String(createProductDto.img3),
        img4:String(createProductDto.img4),
        products:categorys.id
      }
   console.log("data2",data2);
   
      // const images=await this.productImageRepository.save(data2);
      return  {
        status: true,
        messsage: "Add Product success !",
        // data: users
              }

      
    } catch (error) {
      return  {
        status: false,
        messsage: "Error Add Product !",
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

  //admin
  adminCheckToken(createAdminCheckLoginDto: CreateAdminCheckLoginDto){
    try{
      let unpack:any= jwt.verifyToken(createAdminCheckLoginDto.token);
      console.log("unpack",unpack);
      
      if(unpack.username=="admin"){
       
        //enter code below this line
        console.log("Bạn Là Admin");
        return {
          status:true,
          message:"Bạn Là Admin"
        }

      }else{
        console.log("Bạn Không Phải Là Admin");
        return {
          status:false,
          message:"Bạn Không Phải Là Admin"
        }
      }
    }
    catch(err){
    console.log("Lỗi Hệ Thống");
    return {
      status:false,
      message:"Lỗi hệ thống"
    }
    
    }
  }

  
}

