import React from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "./CartCard.css";

const CartCard = ({ item, deleteCartItems }) => {
  const totalPrice = item.price * item.quantity;
  return (
    <>
      <div className="CartItemCard">
        <img src={item?.productImg?.url} alt="cartImg" />
        <div>
          <Link>
            <span>{`Price: Rs. ${totalPrice}`}</span>
            <p onClick={deleteCartItems}>
              <FaTrash style={{ color: "red" }} />
            </p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartCard;
