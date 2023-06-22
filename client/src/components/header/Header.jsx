import React, { useEffect, useState } from "react";
import "./Header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useNavigate } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Logo from "../../images/Logo.png";

import {
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
  FaCartPlus,
  FaStar,
  FaChartLine,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import decode from "jwt-decode";
import { setLogout, setUser } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import { resetCart, setLoggedIn } from "../../redux/features/cartSlice";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user?.token) {
      const decodedData = decode(user.token);
      if (decodedData.exp * 1000 < new Date().getTime()) {
        dispatch(setLogout());
        navigate("/login");
        toast.warning("session has been expired!");
      } else {
        dispatch(setUser(user));
      }
    }
  }, [dispatch, navigate, user]);

  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(setLoggedIn(false));
    // dispatch(resetCart());
    toast.success("Logout successfully!");
    localStorage.removeItem("profile");
    navigate("/login");
  };
  const myStyle = {
    textDecoration: "none",
    margin: "8px",
    color: "gray",
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <div>
            <NavLink to="/">
              <img style={{ width: "150px" }} src={Logo} alt="Business logo" />
            </NavLink>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user && user ? (
                <>
                  <NavLink style={myStyle}>
                    <img
                      style={{
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        border: "2px solid #fff",
                        boxShadow: "0 0 3px rgba(0, 0, 0, 0.3)",
                      }}
                      src={user.user?.avatar?.url}
                      alt="nav img"
                    />
                  </NavLink>
                  <NavDropdown
                    title={user.user?.fullName}
                    id="navbarScrollingDropdown"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                    show={showDropdown}
                  >
                    {user && user.user?.role === "admin" && (
                      <NavDropdown.Item as={NavLink} to="/admin/dashboard">
                        <FaChartLine />
                        Admin Dashboard
                      </NavDropdown.Item>
                    )}

                    <NavDropdown.Item
                      as={NavLink}
                      to="/profile"
                      className="transparent-bg"
                    >
                      <FaUserCircle />
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={NavLink} to="/orders">
                      <FaCartPlus /> My Orders
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={NavLink}
                      to="/my/profile"
                      className="transparent-bg"
                    >
                      <FaStar />
                      Review Products
                    </NavDropdown.Item>

                    {user && user.user?.role === "user" && (
                      <NavDropdown.Item as={NavLink} to="/cart/details">
                        <FaShoppingCart />
                        Cart
                      </NavDropdown.Item>
                    )}

                    <button
                      style={{
                        color: "black",
                        border: "none",
                        outline: "none",
                        background: "transparent",
                      }}
                      className="btn btn-danger"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="btn btn-primary me-2"
                    style={{
                      // marginLeft: "10px",
                      borderRadius: "20px",
                    }}
                  >
                    Login
                  </NavLink>
                </>
              )}
              <NavLink
                style={{ color: "gray", position: "relative" }}
                to="/cart/details"
                className="d-flex align-items-center"
              >
                <FaShoppingCart
                  size={24}
                  style={{ color: items.length || !user ? "#103755" : "unset" }} // Update condition for cart icon color
                />
                {user &&
                  user.user?.role === "user" && ( // Check if user is logged in
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="cart-tooltip">View Cart</Tooltip>}
                    >
                      <span
                        className="ms-auto badge rounded-pill bg-warning text-dark"
                        style={{
                          position: "absolute",
                          top: "0px",
                          right: 0,
                          width: "1em",
                          height: "1.5em",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {user ? items.length : 0}{" "}
                        {/* Display 0 if user is not logged in */}
                      </span>
                    </OverlayTrigger>
                  )}
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
