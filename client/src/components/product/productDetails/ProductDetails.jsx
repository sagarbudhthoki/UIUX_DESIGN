import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import { FaCartPlus, FaCreditCard } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Rating from "react-rating-stars-component";

import {
  clearError,
  clearReviewError,
  createReview,
  getSingleProduct,
} from "../../../redux/features/productSlice";
import Loader from "../../layout/loader/Loader";

import ReviewCard from "./ReviewCard";
import { addItem } from "../../../redux/features/cartSlice";

const ProductDetails = () => {
  const { loading, error, reviewError, product } = useSelector(
    (state) => state.product
  );
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const options1 = {
    edit: false,
    color: "rgba(20, 20, 20, 0.1)",
    activeColor: "#ffd707",
    size: window.innerWidth < 600 ? 20 : 25,
    isHalf: true,
    value: product.ratings,
  };

  const newStyle = {
    color: "#48BB78",
    padding: "8px 0px 0px",
    font: "14px",
  };
  const handleAddToCart = (product) => {
    dispatch(addItem({ product, quantity }));
    toast.success("Item added to cart!");
  };

  const handleSubmitReview = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const handleDecrement = () => {
    if (1 >= quantity) return;
    const qty = quantity - 1;
    setQuantity(qty);
  };

  const handleIncrement = () => {
    if (product.IsInStock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };
  const reviewSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    const newReview = {
      rating: rating,
      comment: comment,
      fullName: user?.fullName,
    };

    const success = dispatch(
      createReview({ rating, comment, productId: id, toast })
    );
    if (success) {
      setReviews([...reviews, newReview]);
      setOpen(false);
    }
  };
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
    if (id) {
      dispatch(getSingleProduct(id));
    }
  }, [dispatch, error, id]);
  useEffect(() => {
    if (product.reviews) {
      setReviews(product.reviews);
    }
  }, [product.reviews]);

  useEffect(() => {
    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearReviewError());
    }
  }, [dispatch, reviewError]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
              <img
                src={product.productImg?.url}
                className="img-fluid product-image"
                alt="product"
              />
            </div>
            <div className="col-lg-4 col-md-12">
              <h2 style={{ color: "#2D3748" }}>{product.productName}</h2>
              <div
                className="mb-3"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div>
                  <ReactStars {...options1} />
                </div>
                <span className="ml-1" style={{ color: "gray" }}>
                  {`(${product.numOfReviews})`}
                </span>
                <hr style={{ borderTop: "2px dotted" }} />
              </div>
              <p className="lead">Now: Rs.{product.price}</p>
              <hr style={{ borderTop: "2px dotted" }} />

              <div className="mb-3">
                {product.IsInStock ? (
                  <>
                    <h6 style={newStyle}>In Stock</h6>
                    <span className="me-2">Quantity:</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleDecrement}
                    >
                      -
                    </button>
                    <span className="mx-2">{quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleIncrement}
                    >
                      +
                    </button>
                    <div className="my-3">
                      <button
                        className="btn btn-custom"
                        style={{ backgroundColor: "#2D3748", color: "white" }}
                        disabled={product.IsInStock < 1 ? true : false}
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaCartPlus /> Add to Cart
                      </button>
                      <button
                        className="btn btn-warning ms-2"
                        onClick={() => alert("Buy Now clicked")}
                      >
                        <FaCreditCard /> Buy Now
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-danger">Out of Stock</p>
                )}
                <hr style={{ borderTop: "2px dotted" }} />
                <div className="mb-3">
                  <h4>Description:</h4>
                  <p>{product.description}</p>
                </div>
                <button onClick={handleSubmitReview} className="submitReview">
                  Submit review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <h3 className="reviewsHeading">Reviews</h3>
      <Modal show={open} onHide={handleSubmitReview} className="submitDialog">
        <Modal.Header closeButton>
          <Modal.Title>Submit Review</Modal.Title>
        </Modal.Header>
        <Modal.Body className="submitDialog">
          <Rating
            name="rating"
            count={5}
            value={rating}
            onChange={(rating) => setRating(rating)}
            size={24}
            activeColor="#ffd700"
            isHalf={false}
          />
          <textarea
            className="form-control"
            name="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            placeholder="Write your review here..."
            style={{ outline: "none", boxShadow: "none" }}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmitReview} variant="danger">
            Cancel
          </Button>
          <Button onClick={reviewSubmitHandler} variant="primary">
            {loading && <Spinner animation="border" size="sm" />}Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {reviews && reviews[0] ? (
        <div className="reviews">
          {reviews &&
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
        </div>
      ) : (
        <p className="noReviews">No reviews Yet</p>
      )}
    </>
  );
};

export default ProductDetails;
