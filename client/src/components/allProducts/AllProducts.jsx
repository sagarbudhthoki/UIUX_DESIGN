import React, { useEffect, useState } from "react";
import "./AllProducts.css";
import { useDispatch, useSelector } from "react-redux";
import AllProductCard from "./AllProductCard";
import { clearError, getAllProducts } from "../../redux/features/productSlice";
import { toast } from "react-toastify";
import Loader from "../layout/loader/Loader";
import Search from "./Search";
import RangeSlider from "react-bootstrap-range-slider";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import Pagination from "react-js-pagination";
import { useParams } from "react-router-dom";

const categories = [
  "All",
  "Laptop",
  "shoes",
  "Electronics",
  "Statue",
  "Attire",
  "Camera",
  "SmartPhones",
];
const AllProducts = () => {
  const { loading, error, products, productsCount, resultPerPage } =
    useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [price, setPrice] = useState([0, 25000]);
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    if (selectedCategory === "All") {
      dispatch(getAllProducts({ keyword, currentPage }));
    } else {
      dispatch(
        getAllProducts({ keyword, currentPage, category: selectedCategory })
      );
    }
  }, [dispatch, keyword, currentPage, selectedCategory]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);
  return (
    <>
      <Search />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="AllProductsContainer">
            {products && products.length > 0 ? (
              products &&
              products.map((product) => (
                <AllProductCard key={product._id} product={product} />
              ))
            ) : (
              <>
                <h2 className="text-center">No Data Found!</h2>
              </>
            )}
          </div>
          <div className="filterBox">
            <RangeSlider
              min={0}
              max={25000}
              value={price}
              onChange={priceHandler}
              variant="primary"
            />
            <p>Category</p>
            <ul className="categoryBox">
              {categories &&
                categories.map((category) => (
                  <li
                    className="category-link"
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </li>
                ))}
            </ul>
          </div>
          {productsCount > 0 && resultPerPage < productsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AllProducts;
