import { IsNotEmpty, IsString } from "class-validator"

export class CreateProductDto {
    // id:string
    title:string
    price:number
    actualprice:number
    block:string

    // @IsNotEmpty()
    categoryId:string
}


