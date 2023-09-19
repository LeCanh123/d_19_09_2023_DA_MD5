import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import path from 'path';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import jwt from 'src/services/jwt';
import MailService from 'src/services/mail';
import genEmailString from 'src/services/template/emailConfirm';
import { TokenUserDto } from './dto/token-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto) {
  //   {
  //     "username": "string1",
  //     "email": "string1",
  //     "emailconfirm": "string",
  //     "firstname": "string",
  //     "lastname": "string",
  //     "password": "string",
  //     "avatar": "string",
  //     "createat":"Date",
  //     "block":"string"
  // }

      try{
      let newUser = this.userRepository.create({...createUserDto,createat:new Date(),emailconfirm:"null",block:"null"})
      let createUserResult=await this.userRepository.save(newUser);

      //gửi mail
      let createConfirmEmailToken= jwt.createToken({...createUserDto,time:new Date()}, 30000);
      console.log("createConfirmEmailToken",createConfirmEmailToken);

      let resultGenEmailString=genEmailString({
        productName:"Clothes Shop",              //tên shop
        productUrl:"canh123.lambogini",
        receiveName:createUserDto.email,               //email người nhận
        confirmLink:`http://127.0.0.1:3000/api/v1/users/confirmemail/${createConfirmEmailToken}`

      })

      await MailService.sendMail({
        to: createUserDto.email,
        subject: "Xác Thực Tài Khoản",
        html: resultGenEmailString
      })

        return {
          status:true,
          message:"Tạo tài khoản thành công,Kiểm tra email để kích hoạt"
        }
      }
      catch(err){
        if(err.toString().includes("user.IDX_e12875dfb3b1d92d7d7c5377e2")){
          return {
            status:false,
            message:"Email đã tồn tại"
          }
        }
        if(err.toString().includes("user.IDX_78a916df40e02a9deb1c4b75ed")){
          return {
            status:false,
            message:"UserName đã tồn tại"
          }
        }
        console.log("err",err);
        
          return {
            status:false,
            message:"Lỗi hệ thống"
          }

      }

  }

  async login(loginUserDto:LoginUserDto) {
      console.log("userdata",loginUserDto);
      //kiểm tra tài khoản là username hay email
            function ValidateEmail(mail:string) 
            {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
            {return true}return false}
      //hàm chính       
      try {
        let isCorrectPassword;
        // const users = await userRepository.find();
        //tìm tên user trong database
        const userAbout = await this.userRepository.find(
          ValidateEmail(loginUserDto.username)?
          //nếu là email
          {where: {email: loginUserDto.username}}:
          //nếu là username
          {where: {username: loginUserDto.username}}
        );

        console.log("userAbout",userAbout);
        isCorrectPassword=await bcrypt.compare(loginUserDto.password, userAbout[0].password);
      //nếu đúng mât khẩu
      if(isCorrectPassword){
        //nếu đăng nhập bằng email
        console.log("ValidateEmail(loginUserDto.username)",ValidateEmail(loginUserDto.username));
        
        if(ValidateEmail(loginUserDto.username)){
          //nếu email chưa xác thực
          console.log("userAbout[0].emailconfirm",userAbout[0].emailconfirm);
          
          if(userAbout[0].emailconfirm=="null"){
            return {
              status:false,
              message:"Email chưa xác thực,hãy đăng nhập bằng userName"
            }
          //nếu email đã xác thực
          }else{
            console.log(`userAbout[0]`,userAbout[0]);
            
            return {
              status:true,
              message:"Đăng nhập thành công",
              token:jwt.createTokenforever({...userAbout[0]}),
              lastname:`${userAbout[0].firstname} ${userAbout[0].lastname}`
            }
          } 
        }
        //nếu đăng nhập bằng userName
        return {
          status:true,
          message:"Đăng nhập thành công",
          token:jwt.createTokenforever({...userAbout[0]}),
          lastname:`${userAbout[0].firstname} ${userAbout[0].lastname}`
        }
      //nếu sai mật khẩu
      }else{
        return {
          status:false,
          message:"Sai mật khẩu"
        }
      }


      } catch (error:any) {
        console.log(error);
        //nếu tìm không thấy người dùng trong database
        if(error.toString().includes("Cannot read properties of undefined")){
          return  {
            status:false,
            message:"Sai tài khoản",
                    }
        }
        //nếu lỗi khác
            return  {
            status:false,
            message:"Lỗi hệ thống",
                    }
      }
    
  
  }

  async checktoken( tokenUserDto:TokenUserDto){
  try{
    let unpack:any= jwt.verifyToken(tokenUserDto.token);
    console.log("unpack,unpack",unpack);
    if(unpack){
      console.log("Giải nén thành công");
      
    }else{
      console.log("Giải nén thất bại");
    }

  }
  catch(err){
    console.log("err dfdf",err);
    

  }
  }








  async comparepassword() {
    try{

      bcrypt.compare("string1", "$2b$10$yBzb10R3kfoW1bRVp7WrguIV3tXuzw7vFfEWsEaR3eD55/vcV8spy", function(err, result) {
        // result == false
        console.log("So Sánh Mk",result);
        
    });
   

    }
    catch(err){

    }

}



async confirmEmail(token:string) {

    try {

      let confirmResult:any={time:new Date,user:String};
      let nowTime:Date=new Date;
      confirmResult=jwt.verifyToken(token);
      console.log(confirmResult);
      const confirmTime: Date = new Date(confirmResult.time);
      //nếu thời gian nhỏ hơn 5 phút (300 giây)
      if((nowTime.getTime() - confirmTime.getTime())/1000<300){
        
        //tìm user trong database
   
        let findUserConfirm=await this.userRepository.find({where:{username:confirmResult.username,emailconfirm:"null"}});

        let updateConfirm=await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ emailconfirm: "true"})
        .where("id = :id", { id: findUserConfirm[0].id })
        .execute()

        return {
          status:true,
          message:"Xác nhận email thành công",
          
        }
      }else{
        return {
          status:false,
          message:"Token đã hết hiệu lực",
          time:(nowTime.getTime() - confirmTime.getTime())/1000
        }
      }

    } catch (error) {
      console.log(error);
      
          return {
          status:false,
          message:"Lỗi hệ thống",
         
        }
    }


}



  findAll() {
    // const filePath = path.join(__dirname, 'user.json');
    // console.log(__dirname);
    
    const usersData = fs.readFileSync("user.json", 'utf8');
    const users = JSON.parse(usersData);
    console.log("users",users);
    return users.users
  }

  findOne(id: number) {
    const usersData = fs.readFileSync('user.json', 'utf8');
    const users = JSON.parse(usersData);
  
    const user = users.users.find((user: any) => user.id === id);
  
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const usersData = fs.readFileSync('user.json', 'utf8');
    const users = JSON.parse(usersData);
  
    const user = users.users.find((user: any) => user.id === id);
  
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    Object.assign(user, updateUserDto);
  
    const updatedUsersData = JSON.stringify(users);
    fs.writeFileSync('user.json', updatedUsersData, 'utf8');
  
    return user;
  }

  remove(id: number) {
    const usersData = fs.readFileSync('user.json', 'utf8');
    const users = JSON.parse(usersData);
  console.log("users",users);
  
    const userIndex = users.users.findIndex((user: any) => user.id === id);
  
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    const removedUser = users.users.splice(userIndex, 1)[0];
  
    const updatedUsersData = JSON.stringify(users);
    fs.writeFileSync('user.json', updatedUsersData, 'utf8');
  
    return removedUser;
  }
}
function generateUniqueId() {
  throw new Error('Function not implemented.');
}

