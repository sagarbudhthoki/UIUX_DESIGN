import React, { useEffect } from "react";
import { FaShoppingCart, FaUsers, FaBox } from "react-icons/fa";
import { Pie, Line } from "@ant-design/plots";
import "./Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { allUsers } from "../../../redux/features/authSlice";
import { getAllProductsByAdmin } from "../../../redux/features/adminSlice";
import { getAllOrders } from "../../../redux/features/orderSlice";
import MetaData from "../../layout/MetaData";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { adminProducts } = useSelector((state) => state.admin);
  const { users } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.order);

  let outOfStock = 0;

  adminProducts &&
    adminProducts.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });
  useEffect(() => {
    dispatch(allUsers());
    dispatch(getAllProductsByAdmin());
    dispatch(getAllOrders());
  }, [dispatch]);

  let totalAmount = 0;
  let incomeData = []; // Define an empty array to hold income data
  orders &&
    orders.forEach((item, index) => {
      totalAmount += item.totalPrice;
      incomeData.push({
        year: index,
        value: item.totalPrice,
      });
    });

  const pieState = {
    data: [
      {
        type: "Out of Stock",
        value: outOfStock,
      },
      {
        type: "In Stock",
        value:
          adminProducts && adminProducts.length
            ? adminProducts.length - outOfStock
            : 0,
      },
    ],
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{percentage}",
    },
  };

  const colors = ["yellow", "green"];

  const lineState = {
    data: [
      {
        year: "Initial Amount",
        value: 0,
      },
      {
        year: "Amount Earned",
        value: totalAmount,
      },
    ],
    xField: "year",
    yField: "value",
    lineStyle: {
      lineWidth: 3,
      stroke: "tomato",
    },
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "tomato",
        lineWidth: 2,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (value) => `Rs.${value}`,
      },
    },
  };

  return (
    <>
      <MetaData title="admin dashboard" />
      <h3>Dashboard</h3>
      <div className="total-amount-container">
        <p>
          Total Amount
          <br />
          Rs.{totalAmount}
        </p>
      </div>
      <div className="d-flex justify-content-between align-content-center gap-3">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/admin/dashboard/product-list"
          >
            <div>
              <p className="desc">Products</p>
              <h4 className="mb-0 sub-title">
                {adminProducts && adminProducts.length}
              </h4>
            </div>
          </Link>
          <div className="d-flex flex-column align-items-end">
            <h6>
              <FaBox />
            </h6>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/admin/dashboard/order-list"
          >
            <div>
              <p className="desc">Orders</p>
              <h4 className="mb-0 sub-title">{orders && orders.length}</h4>
            </div>
          </Link>
          <div className="d-flex flex-column align-items-end">
            <h6>
              <FaShoppingCart />
            </h6>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/admin/dashboard/customer-list"
          >
            <div>
              <p className="desc">Users</p>
              <h4 className="mb-0 sub-title">{users && users.length}</h4>
            </div>
          </Link>
          <div className="d-flex flex-column align-items-end">
            <h6>
              <FaUsers />
            </h6>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="mb-5 title">Income statics</h3>
        <div className="line-chart-container">
          <div className="chart">
            <Line {...lineState} />
          </div>
          <div className="chart">
            <Pie {...pieState} color={colors} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
