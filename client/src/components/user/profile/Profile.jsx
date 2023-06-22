import React, { useEffect } from "react";
import "./Profile.css";
import { Col, Container, Row, Form } from "react-bootstrap";
import {
  FaUserEdit,
  FaKey,
  FaShoppingCart,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, profile } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";
import Loader from "../../layout/loader/Loader";
import MetaData from "../../layout/MetaData";

const Profile = () => {
  const { loading, error, singleUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const myStyle = {
    textDecoration: "none",
    color: "#707B8E",
  };

  const handleChange = (e) => {};

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    dispatch(profile());
  }, [dispatch, error]);

  return (
    <>
      <MetaData title="profile" />

      {loading ? (
        <Loader />
      ) : (
        <Container className="my-5">
          <div className="border p-3">
            <Row>
              <Col md={6} className="mb-3 mb-md-0 border-right">
                {/* Left column */}
                <div className="d-flex flex-column align-items-center">
                  <div className="position-relative">
                    <img
                      src={singleUser?.avatar?.url}
                      alt="Profile"
                      className="rounded-circle"
                      style={{
                        width: "200px",
                        borderRadius: "50%",
                        height: "200px",
                        objectFit: "cover",
                        border: "2px solid #fff",
                        boxShadow: "0 0 3px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                    {singleUser?.verified && (
                      <div
                        className="position-absolute start-50 translate-middle-x"
                        style={{
                          borderRadius: "50%",
                          padding: "5px",
                          bottom: "0px",
                        }}
                      >
                        <FaCheckCircle
                          className="text-success"
                          size={18}
                          style={{ position: "relative", bottom: "-10px" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="profile-menu d-flex flex-column align-items-start">
                    <NavLink
                      style={myStyle}
                      to="/profile/update"
                      className="profile-menu-link"
                      activeClassName="profile-menu-link-active"
                    >
                      <FaUserEdit className="mr-2" />
                      Update Profile
                    </NavLink>
                    <NavLink
                      style={myStyle}
                      to="/change/password"
                      className="profile-menu-link"
                      activeClassName="profile-menu-link-active"
                    >
                      <FaKey className="mr-2" />
                      Change Password
                    </NavLink>
                    <NavLink
                      style={myStyle}
                      to="/orders"
                      className="profile-menu-link"
                      activeClassName="profile-menu-link-active"
                    >
                      <FaShoppingCart className="mr-2" />
                      My Orders
                    </NavLink>
                    <NavLink
                      style={myStyle}
                      to="/profile/reviews"
                      className="profile-menu-link"
                      activeClassName="profile-menu-link-active"
                    >
                      <FaStar className="mr-2" />
                      My Reviews
                    </NavLink>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                {/* Right column */}
                <h2 style={{ color: "#707B8E" }}>Information</h2>
                <div className="p-3">
                  <Form>
                    <Form.Group controlId="formFullName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter full name"
                        onChange={handleChange}
                        value={singleUser?.fullName}
                        style={{ outline: "none", boxShadow: "none" }}
                      />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        onChange={handleChange}
                        value={singleUser?.email}
                        style={{ outline: "none", boxShadow: "none" }}
                      />
                    </Form.Group>
                    <Form.Group controlId="formMobile">
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter mobile number"
                        onChange={handleChange}
                        value={singleUser?.mobileNo}
                        style={{ outline: "none", boxShadow: "none" }}
                      />
                    </Form.Group>
                    <Form.Group controlId="formRole">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter role"
                        onChange={handleChange}
                        value={singleUser?.role}
                        style={{ outline: "none", boxShadow: "none" }}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      )}
    </>
  );
};

export default Profile;
