import React, { useEffect, useState } from "react";
import Forgot from "../../../images/Forgot.png";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import MetaData from "../../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, passwordForgot } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [forgotValue, setForgotValue] = useState({
    email: "",
  });

  const { email } = forgotValue;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setForgotValue({ ...forgotValue, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("email must be filled!");
    }
    dispatch(passwordForgot({ forgotValue, navigate, toast }));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <MetaData title="forget password" />
      <div className="container my-5">
        <Row className="justify-content-center">
          <Col md={6} className="mb-4 mb-md-0">
            <img src={Forgot} alt="Forgot Password" className="img-fluid" />
          </Col>
          <Col md={6} className="d-flex flex-column justify-content-center">
            <h2 style={{ color: "#707B8E" }}>Forgot your password?</h2>
            <p style={{ color: "gray" }}>
              Don’t worry! Just fill in your email and we’ll help you <br />
              reset your password.
            </p>
            <Form onSubmit={handleSubmit} className="">
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
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <button
                className="my-1 btn btn-custom form-control"
                style={{ backgroundColor: "#2D3748", color: "white" }}
                type="submit"
              >
                {loading && <Spinner animation="border" size="sm" />}Submit
              </button>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ForgotPassword;
