import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const AllProductCard = ({ product }) => {
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "#ffd707",
    size: window.innerWidth < 600 ? 20 : 25,
    value: product.ratings,
    isHalf: true,
  };
  return (
    <>
      <Link className="AllProductCard" to={`/product/details/${product._id}`}>
        <img src={product.productImg?.url} alt={product.productName} />
        <p className="text-center">{product?.productName}</p>
        <div>
          <ReactStars {...options} /> <span> ({product?.numOfReviews})</span>
        </div>
        <strong style={{ textAlign: "center" }}>{`Rs${product?.price}`}</strong>
      </Link>
    </>
  );
};

export default AllProductCard;
