import axios from 'axios';

export default {
    getMenproduct:async (data:any)=> {
        return axios.get(import.meta.env.VITE_SERVER_HOST+`api/v1/products/findall/`)
          .then(res => {
            // return res
            return {data:res.data.data,
            total:1
                  }
          })
          .catch(error => 
            
            {
                return {data:[{id:1}],
                total:4
                        }
            }
            );
        // return {data:[{id:1},{id:2},{id:3},{id:4}],
        //         total:1
        //         }
    },
    getCategory:async (token:any)=> {
      return axios.post(import.meta.env.VITE_SERVER_HOST+`api/v1/category/usergetcategory`,{token})
        .then(res => {
          return res
        })
        .catch(error => 
          {
            return {data:{
              status:false,
              message:"Lỗi hệ thống"
            }}
        }
          );
    },
    getProductByCategory:async (token:any,category:any)=> {
      return axios.post(import.meta.env.VITE_SERVER_HOST+`api/v1/products/getproductbycategory`,{token,listCategory:category})
        .then(res => {
          return res
        })
        .catch(error => 
          {
            return {data:{
              status:false,
              message:"Lỗi hệ thống"
            }}
        }
          );
    },
    }