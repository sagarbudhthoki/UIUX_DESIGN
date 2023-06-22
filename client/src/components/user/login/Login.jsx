import React, { useEffect, useState } from "react";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import LoginImg from "../../../images/login.png";
import { useDispatch, useSelector } from "react-redux";
import "./Login.css";
import { toast } from "react-toastify";
import { clearError, login } from "../../../redux/features/authSlice";
import MetaData from "../../layout/MetaData";

const initialState = {
  email: "",
  password: "",
};
const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState(initialState);
  const [loginErrors, setLoginErrors] = useState({});
  const [termsChecked, setTermsChecked] = useState(false);

  let { email, password } = loginValue;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setLoginValue({ ...loginValue, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!email) {
      newErrors.email = "email is required!";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      newErrors.email = "Invalid email";
    }
    if (!password) {
      newErrors.password = "password is required!";
    } else if (password.length < 8) {
      newErrors.password = "password must be 8 characters long";
    }

    setLoginErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (email && password) {
        dispatch(login({ loginValue, navigate, toast }));
      }
    } else {
      return toast.warning("Invalid input!");
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
      <MetaData title="login" />
      <div className="container my-5">
        <Row>
          <Col md={6} className="d-none d-md-block">
            <img src={LoginImg} alt="LoginProfile" className="img-fluid" />
          </Col>
          <Col md={6} className="mt-3">
            <h2 style={{ color: "#707B8E" }}>Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                />
                {loginErrors && (
                  <span style={{ color: "red" }}>{loginErrors.email}</span>
                )}
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                />

                {loginErrors && (
                  <span style={{ color: "red" }}>{loginErrors.password}</span>
                )}
              </Form.Group>

              <div className="mt-0">
                <Link
                  to="/forget/password"
                  style={{ textDecoration: "none", color: "#707B8E" }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="form-group form-check my-1">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="acceptTerms"
                  onChange={() => setTermsChecked(!termsChecked)}
                />
                <label
                  htmlFor="acceptTerms"
                  className="form-check-label"
                  style={{
                    color: "gray",
                    fontWeight: "8px",
                    fontSize: "smaller",
                  }}
                >
                  I hereby accept all the Terms & Conditions of HamroShop.
                </label>
              </div>
              <button
                className="my-1 btn btn-custom form-control"
                style={{ backgroundColor: "#2D3748", color: "white" }}
                type="submit"
                disabled={!termsChecked}
              >
                {loading && <Spinner animation="border" size="sm" />}Login
              </button>
              <p>
                Don't have an account?
                <Link
                  style={{ textDecoration: "none", color: "#707B8E" }}
                  to="/register"
                >
                  register
                </Link>
              </p>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Login;
