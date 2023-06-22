import React from "react";
import "./ConfirmOrder.css";
import MetaData from "../../layout/MetaData";
import CheckOutStep from "../checkOutSteps/CheckOutStep";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
  const { shippingInfo, items } = useSelector((state) => state.cart);
  const { singleUser } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/paymentsuccess");
  };

  const subtotal =
    items && items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address = `${shippingInfo.address},${shippingInfo.city},${shippingInfo.state},${shippingInfo.pinCode},${shippingInfo.country}`;
  return (
    <>
      <MetaData title="Confirm Order" />
      <CheckOutStep activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmShippingArea">
            <p>Shipping Info</p>
            <div className="confirmShippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{singleUser?.fullName}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <p>Your Cart Items:</p>
            <div className="confirmCartItemsContainer">
              {items &&
                items.map((item) => (
                  <div key={item._id}>
                    <img src={item.productImg?.url} alt="Product" />
                    <Link to={`/product/details/${item._id}`}>
                      {item.productName}
                    </Link>
                    <span>
                      {item.quantity} X Rs.{item.price} =
                      <b>Rs.{item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <p>Order Summery</p>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>Rs.{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>Rs.{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>Rs.{tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>Rs.{totalPrice}</span>
            </div>

            <button onClick={proceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
