import axios from 'axios';

export default {
  //category
  getCategory:(token:any)=> {
        console.log("newUser",token);
        return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/adminproduct/getcategory`,{token})
          .then(res => {
            // console.log(res);
            return res
          })
          .catch(error => 
            {
              console.log(error)
              return {data:{
                status:false,
                message:"Lỗi hệ thống"
              }}
          }
            );
      },
  addCategory:(token:any,category:any)=> {
        console.log("data",category);
        return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/adminproduct/addcategory`,{category,token})
          .then(res => {
            // console.log(res);
            return res
          })
          .catch(error => 
            {
                // console.log(error)
                return {data:{
                  status:false,
                  message:"Lỗi hệ thống"
                }}
            }
            );
      },
  deleteCategory:(token:any,id:any)=> {
    console.log("data",token);
    return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/adminproduct/deletecategory`,{token,id})
      .then(res => {
        // console.log(res);
        return res
      })
      .catch(error => 
        {
            // console.log(error)
            return {data:{
              status:false,
              message:"Lỗi hệ thống"
            }}
        }
        );
      },
  //product
  addProduct:(data:any)=> {
        console.log("data",data);
        return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/adminproduct/addproduct`,data)
          .then(res => {
            return res
          })
          .catch(error => 
            {
              // console.log(error)
              return {data:{
                status:false,
                message:"Lỗi hệ thống"
              }}
          }
            );
      },
  getProduct:(token:any,data:any)=> {
      console.log("data",data);
      return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/adminproduct/getproduct`,{token,data})
        .then(res => {
          return res
        })
        .catch(error => 
          {
            // console.log(error)
            return {data:{
              status:false,
              message:"Lỗi hệ thống"
            }}
        }
          );
      },
  deleteteProduct:(token:any,id:any)=> {
    return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/adminproduct/deleteproduct`,{token,id})
      .then(res => {
        return res
      })
      .catch(error => 
        {
          // console.log(error)
          return {data:{
            status:false,
            message:"Lỗi hệ thống"
          }}
      }
        );
    },
  productGetCategory:(token:any)=> {
    // console.log("newUser",token);
    return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/adminproduct/productgetcategory`,{token})
      .then(res => {
        // console.log(res);
        return res
      })
      .catch(error => 
        {
          console.log(error)
          return {data:{
            status:false,
            message:"Lỗi hệ thống"
          }}
      }
        );
    },
  //checklogin
  adminCheckLogin:(token:any)=> {
    // console.log("newUser",token);
    return axios.post(import.meta.env.VITE_SERVER_HOST+`apis/v1/adminproduct/adminchecklogin`,{token})
      .then(res => {
        // console.log(res);
        return res
      })
      .catch(error => 
        {
          console.log(error)
          return {data:{
            status:false,
            message:"Lỗi hệ thống"
          }}
      }
        );
    },
    }