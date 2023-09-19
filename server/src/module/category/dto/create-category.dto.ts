import { Allow } from "class-validator";

export class CreateCategoryDto {
    @Allow()
    sex:string
    
    @Allow()
    name:string

    @Allow()
    block:string

    // @Allow()
    // productsId:number
}

// {
//     "sex":"men",
//     "name":"áo gió",
//     "block":"null"
// }
