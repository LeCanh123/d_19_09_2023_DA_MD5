import axios from 'axios';

export default {
    getMenproduct:async (data:any)=> {
        return axios.get(import.meta.env.VITE_SERVER_HOST+`apis/v1/userproduct/getmenproduct/`)
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
      return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/userproduct/getcategory`,{token})
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
      return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/userproduct/getproductbycategory`,{token,category})
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