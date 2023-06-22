import React, { useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import {
  clearError,
  deleteOrder,
  getAllOrders,
} from "../../../../redux/features/orderSlice";

const OrderList = () => {
  const { loading, error, orders } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteOrder({ id, toast }));
  };

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <h4>All Orders</h4>
      <div className="product-list">
        <div className="d-flex justify-content-between align-items-center mb-3"></div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Order Id
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Product Img
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Name
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Items Qty
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Status
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Amount
              </th>

              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Created At
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              </>
            ) : (
              <>
                {orders && orders.length > 0 ? (
                  orders &&
                  orders.map((order) => (
                    <>
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>
                          {order?.orderItems && order.orderItems.length > 0 && (
                            <img
                              src={order.orderItems[0].productImg?.url}
                              alt="order Img"
                              height={50}
                            />
                          )}
                        </td>
                        <td>{order.user?.fullName}</td>
                        <td>
                          {order?.orderItems?.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          )}
                        </td>
                        <td
                          style={{
                            color:
                              order.orderStatus === "Delivered"
                                ? "green"
                                : order.orderStatus === "shipped"
                                ? "yellow"
                                : "red",
                          }}
                        >
                          {order.orderStatus}
                        </td>
                        <td>Rs.{order.totalPrice}</td>
                        <td>{moment(order?.createdAt).format("YYYY-MM-DD")}</td>

                        <td>
                          <Link to={`/admin/dashboard/edit/order/${order._id}`}>
                            <FaPencilAlt />
                          </Link>
                          <Link
                            onClick={() => handleDelete(order._id)}
                            style={{ color: "red" }}
                          >
                            <FaTrash />
                          </Link>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <>
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center" }}>
                        No data found.
                      </td>
                    </tr>
                  </>
                )}
              </>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default OrderList;
