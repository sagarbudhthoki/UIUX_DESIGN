import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Badge,
  Image,
  Form,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
  OrderSingleDetail,
  clearError,
  clearOrder,
  orderUpdateProcess,
} from "../../../../redux/features/orderSlice";
import Loader from "../../../layout/loader/Loader";
import MetaData from "../../../layout/MetaData";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const EditOrder = () => {
  const { id } = useParams();
  const { loading, isLoading, error, order } = useSelector(
    (state) => state.order
  );

  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState(order?.orderStatus);

  const handleUpdateProcessHandler = (e) => {
    e.preventDefault();
    dispatch(orderUpdateProcess({ id: id, status: status, toast: toast }));
    setOrderStatus(status);
  };

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
    if (id) {
      dispatch(OrderSingleDetail(id));
    }
    return () => {
      dispatch(clearOrder());
    };
  }, [dispatch, error, id]);

  return (
    <>
      <MetaData title="User Order Details" />
      {loading ? (
        <Loader />
      ) : (
        <Container className="my-4">
          <Row>
            <Col md={8}>
              <h3 style={{ color: "tomato" }}>
                <Link
                  to="/admin/dashboard/order-list"
                  style={{ color: "black", marginRight: "1rem" }}
                >
                  <FaArrowLeft />
                </Link>
                Process Order
              </h3>
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
                    {order && (
                      <span
                        className={`order-status ${
                          orderStatus === "Delivered"
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        {orderStatus || order.orderStatus}
                      </span>
                    )}
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
                    <strong>Payment Status:</strong>
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
              {order && order.orderItems && order.orderItems.length > 0 ? (
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
                <p>No data found.</p>
              )}
            </Col>
            {order && order.orderStatus !== "Delivered" && (
              <Col md={6}>
                <h4 className="mt-4 mb-3">Payment Process</h4>
                <Form.Group controlId="PaymentProcess">
                  <Form.Label>Payment process</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    onChange={(e) => setStatus(e.target.value)}
                    style={{
                      width: "400px",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    <option value="">Select process</option>
                    {order?.orderStatus === "processing" && (
                      <>
                        <option value="Shipped">Shipped</option>
                        <option value="Cancelled">Cancelled</option>
                      </>
                    )}
                    {order?.orderStatus === "Shipped" && (
                      <option value="Delivered">Delivered</option>
                    )}
                  </Form.Control>
                </Form.Group>

                <button
                  className="my-2 btn btn-custom form-control"
                  style={{ backgroundColor: "#2D3748", color: "white" }}
                  type="submit"
                  onClick={handleUpdateProcessHandler}
                >
                  {isLoading && <Spinner animation="border" size="sm" />}update
                  process
                </button>
              </Col>
            )}
          </Row>
        </Container>
      )}
    </>
  );
};

export default EditOrder;
