import React, { useEffect } from "react";
import "./Home.css";
import CommonPage from "../commonPages/CommonPage";
import HomeImg from "../../images/Food.png";
import MetaData from "../layout/MetaData";
import Loader from "../layout/loader/Loader";
import ProductCard from "./productCard/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "../../redux/features/productSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Home = () => {
  const { loading, error, products } = useSelector((state) => ({
    ...state.product,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  // useEffect(() => {
  //   dispatch(getAllProducts());
  // }, [dispatch]);

  return (
    <>
      <MetaData title="Hamro Shop" />
      <CommonPage
        title="Welcome to"
        description="that is one-stop destination for all your 
        online shopping needs. We are a fast-growing E-commerce
         business that was founded with the aim of making online
          shopping accessible, affordable, and convenient for everyone"
        btnHome="Get more info"
        homeImg={HomeImg}
        visit="/about"
      />
      <div className="container-fluid mb-4">
        <div className="row">
          <div className="col-10 mx-auto">
            <div className="row gy-4">
              <div className="d-flex justify-content-between align-items-center w-100">
                <h2 className="productHeader">Top Picks</h2>
                <Link to="/all/products">
                  <button
                    className="btn btn-custom"
                    style={{ backgroundColor: "#103755", color: "white" }}
                  >
                    Show more
                  </button>
                </Link>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <>
                  {products && products.length > 0 ? (
                    products &&
                    products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                  ) : (
                    <>
                      <div className="my-5">
                        <h2 className="text-center">No Data Found!</h2>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
