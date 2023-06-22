import React, { useEffect } from "react";
import "./OrderDetails.css";
import { Container, Row, Col, Badge, Image } from "react-bootstrap";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { OrderSingleDetail, clearError } from "../../redux/features/orderSlice";
import { useParams } from "react-router-dom";
import Loader from "../layout/loader/Loader";

const OrderDetails = () => {
  const { id } = useParams();
  const { loading, error, order } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
    if (id) {
      dispatch(OrderSingleDetail(id));
    }
  }, [dispatch, error, id]);

  return (
    <>
      <MetaData title="Order Details" />
      {loading ? (
        <Loader />
      ) : (
        <Container className="my-4">
          <Row>
            <Col md={8}>
              <h3 style={{ color: "tomato" }}>Order # {order && order._id}</h3>
              <hr />
              <h4 className="mt-4 mb-3">Shipping Info</h4>
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Name:</strong>
                    {order && order.user && order.user.fullName}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong>
                    {order && order.user && order.user.email}
                  </p>
                  <p className="mb-2">
                    <strong>Phone:</strong>
                    {order && order.shippingInfo && order.shippingInfo.phoneNo}
                  </p>
                  <p className="mb-2">
                    <strong>Address:</strong>
                    {order &&
                      order.shippingInfo &&
                      `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo?.country}`}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Order Status:</strong>
                    <span
                      className={`order-status ${
                        order && order.orderStatus === "Delivered"
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {order && order.orderStatus}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong>Ordered On:</strong>
                    {order &&
                      order.createdAt &&
                      new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="mb-2">
                    <strong>Total Price:</strong>
                    <Badge variant="primary">
                      Rs.{order && order.totalPrice}
                    </Badge>
                  </p>
                  <p className="mb-2">
                    <strong>Payment Status:</strong>{" "}
                    {order &&
                    order.paymentInfo &&
                    order.paymentInfo.status === "succeeded" ? (
                      <Badge bg="success">PAID</Badge>
                    ) : (
                      <Badge bg="danger">NOT PAID</Badge>
                    )}
                  </p>
                </Col>
              </Row>
              <hr />
              <h4 className="mt-4 mb-3">Order Items:</h4>
              {order && order.orderItems ? (
                order.orderItems.map((item) => (
                  <Row key={item._id} className="my-4">
                    <Col md={2}>
                      <Image
                        src={item.productImg?.url}
                        alt={item.productName}
                        fluid
                      />
                    </Col>
                    <Col md={6}>
                      <h5>{item.productName}</h5>
                      <p>
                        Rs. {item.price} X {item.quantity}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <strong>Subtotal:</strong>
                        <Badge variant="primary">
                          Rs. {item.price * item.quantity}
                        </Badge>
                      </p>
                    </Col>
                  </Row>
                ))
              ) : (
                <p>No order items found.</p>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default OrderDetails;
