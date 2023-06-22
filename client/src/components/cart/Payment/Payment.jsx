import React, { useEffect, useRef } from "react";
import "./Payment.css";
import * as api from "../../../redux/api.js";
import MetaData from "../../layout/MetaData";
import CheckOutStep from "../checkOutSteps/CheckOutStep";
// import { FaCcStripe, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addOrder, clearError } from "../../../redux/features/orderSlice";
import { Spinner } from "react-bootstrap";

const Payment = () => {
  const { user } = useSelector((state) => state.auth);
  const { error, loading } = useSelector((state) => state.order);
  const { shippingInfo, items } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const payBtn = useRef(null);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: items,
    itemsPrice: orderInfo.subtotal,
    taxPrice: orderInfo.tax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const { data } = await api.addPayment(paymentData);
      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            fullName: user.fullName,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });
      if (result.error) {
        payBtn.current.disabled = false;
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(addOrder({ order, navigate, toast }));
        } else {
          toast.error("There some issues while processing payment!");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);
  return (
    <>
      <MetaData title="Payment Details" />
      <CheckOutStep activeStep={2} />
      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <p>Card Info</p>
          <div>
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <CardCvcElement className="paymentInput" />
          </div>

          <div>
            {loading && <Spinner animation="border" size="sm" />}
            <input
              type="submit"
              value={`Pay - Rs.${orderInfo && orderInfo.totalPrice}`}
              ref={payBtn}
              className="paymentFormBtn"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default Payment;
