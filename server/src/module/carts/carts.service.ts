import { Inject, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Bag } from '../bags/entities/bag.entity';
import { User } from '../users/entities/user.entity';
import jwt from 'src/services/jwt';


@Injectable()
export class CartsService {
  constructor(
    @Inject('CART_REPOSITORY')
    private cartRepository: Repository<Cart>,

    @Inject('BAG_REPOSITORY')
    private bagRepository: Repository<Bag>,

    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,


  ) {}

//thêm sp vào giỏ
  async create(createCartDto: CreateCartDto) {
    console.log("createCartDto",createCartDto);
    
    try{
      let unpack:any= jwt.verifyToken(createCartDto.token);
      if(unpack){
       
        //tìm thông tin user
        let findUser1=await this.userRepository.find({where:{username:unpack.username}});
        //thêm sản phẩm vào giỏ hàng
        //tìm giỏ hàng
        let findUserBag=await this.bagRepository.find({where:{user:{id:unpack.id},block:"null"}});
        //nếu không thấy giỏ hàng
        //tạo giỏ hàng
        if(findUserBag.length==0){
          let createUserBag=await this.bagRepository.save({block:"null",user:{id:findUser1[0]?.id!}});
          //thêm hàng vào giỏ vừa tạo
          let addUserCart=await this.cartRepository.save({block:"null",bag:{id:createUserBag?.id!},quantity:1,products:createCartDto.id});
          return {
            status: true,
            message: "Thêm sản phẩm thành công",
          }
        //nếu thấy giỏ hàng
        }else{
        //tìm sản phẩm trong giỏ hàng
        let findUserCart=await this.cartRepository.find({where:{block:"null",bag:{id:findUserBag[0].id},products:{id:createCartDto.id}}});
            //nếu sản phẩm chưa có trong giỏ hàng
            if(findUserCart.length==0){
                //thêm hàng vào giỏ vừa tìm
                let addUserCart=await this.cartRepository.save({block:"null",bag:{id:findUserBag[0].id!},quantity:1,products:createCartDto.id});
                return { 
                  status: true,
                  message: "Add Product success !",
                  // data: null
                      }
            }
             //nếu sản phẩm đã có trong giỏ hàng
            else{
                //update hàng trong giỏ vừa tìm
                let addUserCart=await this.cartRepository
                                      .createQueryBuilder()
                                      .update(Cart)
                                      .set({ quantity:(findUserCart[0].quantity+1)})
                                      .where("id = :id", { id: findUserCart[0].id })
                                      .execute()
                
                return {
                  status: true,
                  message: "Add Product success !",
                  // data: null
                      }
            }
        }
      }
      return {
        status: false,
        message: "Chưa đăng nhập",
      }
    }
    catch(err){
      return {
        status: false,
        message: "Add Product thất bại !",
        // data: null
            }
    }
  }

  findAll() {
    return `This action returns all carts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
