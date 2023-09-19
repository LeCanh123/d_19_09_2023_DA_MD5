import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import {  LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request,Response } from 'express';
import { ApiBody, ApiExtraModels, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Any } from 'typeorm';
import * as path from 'path';
import { TokenUserDto } from './dto/token-user.dto';





@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiExtraModels(CreateUserDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John Doe',
        },
        age: {
          type: 'number',
          example: 30,
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})

  create(@Body() createUserDto: CreateUserDto) {
    console.log("vào create user");
    
    return this.usersService.create(createUserDto); 
  }


  @Get("confirmemail/:token")
  async confirm(@Param('token') token: string, @Res() res: Response) {
    // return this.usersService.confirmEmail(token);
    console.log("req.params",token);
    let confirmResult= await this.usersService.confirmEmail(token)
    const filePath = path.join('./../src/services/template/returnHomePage.ejs'); 
    console.log("filePath",filePath);
    res.render(filePath,{message:confirmResult.message})
  }


  @Get()
  findAll() {
    return this.usersService.comparepassword();
  }

  @Post("login")
  login(@Body() loginUserDto:LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Post("checktoken")
  checktoken(@Body() tokenUserDto:TokenUserDto) {
    return this.usersService.checktoken(tokenUserDto);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get("/123/1")
  findAll1(@Res() response: Response) {
    // Sửa đổi mã trạng thái thành 200
    response.status(203).json('OK');
  }
}
