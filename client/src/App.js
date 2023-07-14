import "./App.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import PageNotFound from "./components/notFound/PageNotFound";
import ScrollTop from "./components/scrollUP/ScrollTop";
import Dashboard from "./components/admin/dashboard/Dashboard";
import MainLayout from "./components/admin/sidebar/MainLayout";
import Enquiries from "./components/admin/pages/Enquiries";
import AddBlog from "./components/admin/pages/blog/AddBlog";
import AddProduct from "./components/admin/pages/addProduct/AddProduct";
import ProductDetails from "./components/product/productDetails/ProductDetails";
import Register from "./components/user/register/Register";
import Login from "./components/user/login/Login";
import Profile from "./components/user/profile/Profile";
import { useEffect } from "react";
import { setUser } from "./redux/features/authSlice";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "./components/layout/protectedRoute/ProtectedRoute";
import UpdateProfile from "./components/user/updateProfile/UpdateProfile";
import ChangePassword from "./components/user/changePassword/ChangePassword";
import CartDetails from "./components/cart/CartDetails";
import Shipping from "./components/cart/shipping/Shipping";
import ConfirmOrder from "./components/cart/orderConfirm/ConfirmOrder";
import Payment from "./components/cart/Payment/Payment";
import { useDispatch, useSelector } from "react-redux";
import OrderSuccess from "./components/cart/orderSuccess/OrderSuccess";
import AllProducts from "./components/allProducts/AllProducts";
import ProductList from "./components/admin/pages/productList/ProductList";
import EditProduct from "./components/admin/pages/editProduct/EditProduct";
import CustomerList from "./components/admin/pages/customer/CustomerList";
import EditCustomer from "./components/admin/pages/editCustomer/EditCustomer";
import ReviewList from "./components/admin/pages/reviewList/ReviewList";
import OrderList from "./components/admin/pages/order/OrderList";
import { getStripe } from "./redux/features/orderSlice";
import MyOrder from "./components/myOrders/MyOrder";
import OrderDetails from "./components/myOrders/OrderDetails";
import EditOrder from "./components/admin/pages/editOrder/EditOrder";
import ForgotPassword from "./components/user/forgetPassword/ForgotPassword";
import ResetPassword from "./components/user/resetPassword/ResetPassword";
import VerifyOtp from "./components/user/verifyOtp/VerifyOtp";

function App() {
  const { stripeKey } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  // const { user, isLoggedIn } = useSelector((state) => state.auth);

  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(getStripe());
  }, [dispatch]);

  return (
    <>
      <Router>
        <Header />
        <ToastContainer position="bottom-right" />

        {stripeKey && (
          <Elements stripe={loadStripe(stripeKey)}>
            <Routes>
              <Route
                path="paymentsuccess"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />

              <Route exact path="/" element={<Home />} />
              <Route path="/forget/password" element={<ForgotPassword />} />
              <Route path="/reset/password" element={<ResetPassword />} />
              <Route path="/all/products" element={<AllProducts />} />
              <Route path="/all/products/:keyword" element={<AllProducts />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify/otp" element={<VerifyOtp />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/details/:id" element={<ProductDetails />} />
              <Route path="/cart/details" element={<CartDetails />} />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/details/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                }
              />

              <Route path="/success" element={<OrderSuccess />} />

              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <Shipping />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/confirm/order"
                element={
                  <ProtectedRoute>
                    <ConfirmOrder />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/update"
                element={
                  <ProtectedRoute>
                    <UpdateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change/password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="product" element={<AddProduct />} />
                <Route
                  path="single/product/edit/:id"
                  element={<EditProduct />}
                />
                <Route path="product-list" element={<ProductList />} />
                <Route path="customer/edit/:id" element={<EditCustomer />} />
                <Route path="customer-list" element={<CustomerList />} />
                <Route path="reviews-list" element={<ReviewList />} />
                <Route path="order-list" element={<OrderList />} />
                <Route path="edit/order/:id" element={<EditOrder />} />
                <Route path="blog" element={<AddBlog />} />
                <Route path="enquiries" element={<Enquiries />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Elements>
        )}
        <ScrollTop />

        <Footer />
      </Router>
    </>
  );
}

export default App;
