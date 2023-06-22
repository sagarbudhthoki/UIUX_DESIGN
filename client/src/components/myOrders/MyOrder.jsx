import React, { useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Table, Spinner } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { allOrders, clearError } from "../../redux/features/orderSlice";

const MyOrder = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  useEffect(() => {
    dispatch(allOrders());
  }, [dispatch]);

  return (
    <>
      <MetaData title={`${user.user.fullName} - Orders`} />
      <div className="my-3 container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <h4>All Orders</h4>

            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Items Qty</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                ) : orders && orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders &&
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td
                        style={{
                          color:
                            order.orderStatus === "Delivered" ? "green" : "red",
                        }}
                      >
                        {order.orderStatus}
                      </td>
                      <td>
                        {order.orderItems?.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}
                      </td>
                      <td>Rs.{order.totalPrice}</td>
                      <td>
                        <Link to={`/order/details/${order._id}`}>
                          <FaEye />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrder;
