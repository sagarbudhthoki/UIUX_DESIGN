import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementItem,
  incrementItem,
  removeItem,
} from "../../redux/features/cartSlice";
import "./CartDetails.css";
import { toast } from "react-toastify";
import CartCard from "./cartCard/CartCard";
import { Link, useNavigate } from "react-router-dom";

const CartDetails = () => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteCartItems = (productId) => {
    dispatch(removeItem(productId));
    toast.success("Items removed!");
  };

  const checkOutHandler = () => {
    if (!user) {
      navigate("/login?redirect=/shipping");
    } else {
      navigate("/shipping");
    }
  };

  const handleIncrement = (productId) => {
    const product = items?.find((item) => item._id === productId);
    if (product && product.IsInStock > product.quantity) {
      dispatch(incrementItem(productId));
    } else {
      toast.warning("Product is out of stock or quantity limit reached");
    }
  };

  const handleDecrement = (productId) => {
    dispatch(decrementItem(productId));
  };

  const subTotal =
    items && Array.isArray(items)
      ? items.reduce(
          (acc, item) =>
            acc + (Number(item.price) * Number(item.quantity) || 0),
          0
        )
      : 0;

  const total = subTotal + 0;

  return (
    <>
      {items && items.length === 0 ? (
        <>
          <div className="emptyCart">
            <p>No Product in your cart</p>
            <Link to="/all/products">View Products</Link>
          </div>
        </>
      ) : (
        <>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {Array.isArray(items) &&
              items.map((item) => (
                <div className="cartContainer" key={item._id}>
                  <CartCard
                    item={item}
                    deleteCartItems={() => deleteCartItems(item._id)}
                  />
                  <div className="cartInput">
                    <button onClick={() => handleDecrement(item._id)}>-</button>
                    <p>{item?.quantity}</p>

                    <button onClick={() => handleIncrement(item._id)}>+</button>
                  </div>
                  <p className="cartSubtotal">{`Rs.${
                    item.price * item.quantity
                  }`}</p>
                </div>
              ))}
            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{total}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkOutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CartDetails;
