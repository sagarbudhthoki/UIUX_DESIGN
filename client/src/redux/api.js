import axios from "axios";
import jwt_decode from "jwt-decode";

export const API = axios.create({ baseURL: "http://localhost:5000/api/v1" });

//use interceptors
// API.interceptors.request.use((req) => {
//   if (localStorage.getItem("profile")) {
//     req.headers.Authorization = `Bearer ${
//       JSON.parse(localStorage.getItem("profile")).token
//     }`;
//   }
//   return req;
// });
API.interceptors.request.use((req) => {
  const token =
    localStorage.getItem("profile") &&
    JSON.parse(localStorage.getItem("profile")).token;

  try {
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        throw new Error("Session ha been expired,please login first!");
      }
      req.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log(error);
  }
  return req;
});

//user route
export const userLogin = (loginValue) => API.post("/login", loginValue);
//verify otp
export const verifyOtp = (otpValue) => API.post("/verify", otpValue);
//forget password
export const forgotPassword = (forgotValue) =>
  API.post("/forget/password", forgotValue);

//reset password
export const resetPassword = (resetValue) =>
  API.put("/reset/password", resetValue);

export const userRegister = (myForm) => API.post("/register", myForm);
export const myProfile = () => API.get("/me");

export const updateProfile = (updateForm) =>
  API.put("/profile/update", updateForm);

export const updatePassword = (passwordValue) =>
  API.put("/change/password", passwordValue);

//admin routes

//add product by admin
export const addProduct = (myForm) => API.post("/add/product", myForm);
//edit product by admin
export const editProduct = (myForm, id) =>
  API.put(`/product/update/${id}`, myForm);
//allProducts by admin
export const allProductsAdmin = () => API.get("/all/products");
export const deleteProduct = (id) => API.delete(`/product/delete/${id}`);
export const adminSingle = (id) => API.get(`/admin/single/product/${id}`);
export const allCustomers = () => API.get("/all/users");
//single USer get by admin
export const singleUser = (id) => API.get(`/single/user/${id}`);
//delete single user by admin
export const deleteRole = (id) => API.delete(`/delete/user/${id}`);

//admin can update role
export const updateRole = (formData, id) =>
  API.put(`/update/role/${id}`, formData);
//products route

export const allProducts = (keyword = "", category = "", currentPage = 1) =>
  API.get(
    `/products?keyword=${keyword}&category=${category}&page=${currentPage}`
  );
export const singleProduct = (id) => API.get(`/single/product/${id}`);
//all products
export const allAdminUsers = () => API.get("/all/users");
//order api
export const createOrder = (order) => API.post("/new/order", order);
//get all orders by admin only
export const getAllOrders = () => API.get("/admin/orders");
//review add
export const addReview = (formData) => API.put("/add/reviews", formData);
//all reviews
export const getReviews = (id) => API.get(`/reviews?id=${id}`);

//delete review
export const deleteReview = (reviewId, productId) =>
  API.delete(`/delete/review?id=${reviewId}&productId=${productId}`);

//payment api
export const getStripeKey = () => API.get("/stripe/api/key");

//payment process
export const addPayment = (paymentData) =>
  API.post("/process/payment", paymentData);

//my orders
export const getOrders = () => API.get("/orders/me");

//single order details
export const singleOrder = (id) => API.get(`/single/order/${id}`);
//delete product
export const deleteOrder = (id) => API.delete(`/delete/order/${id}`);
//update product
export const updateProcessOrder = (id, status) =>
  API.put(`/update/order/${id}`, { status });
