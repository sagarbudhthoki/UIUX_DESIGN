import React, { useEffect, useState } from "react";
import Forgot from "../../../images/Forgot.png";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import MetaData from "../../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { accountVerify, clearError } from "../../../redux/features/authSlice";

const VerifyOtp = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState({
    otp: "",
  });

  const { otp } = otpValue;

  const handleChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    setOtpValue({ ...otpValue, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      return toast.error("otp must be filled!");
    }
    dispatch(accountVerify({ otpValue, navigate, toast }));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <MetaData title="verify account" />
      <div className="container my-5">
        <Row className="justify-content-center">
          <Col md={6} className="mb-4 mb-md-0">
            <img src={Forgot} alt="verify Otp" className="img-fluid" />
          </Col>
          <Col md={6} className="d-flex flex-column justify-content-center">
            <h2 style={{ color: "#707B8E" }}>Verify your OTP?</h2>
            <p style={{ color: "gray" }}>
              Don’t worry! Just fill in your Otp and we’ll help you <br />
              login page.
            </p>
            <Form onSubmit={handleSubmit} className="">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Otp</Form.Label>
                <Form.Control
                  type="number"
                  name="otp"
                  placeholder="Enter otp"
                  value={otp}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                />
                <Form.Text className="text-muted">
                  We'll never share your otp with anyone else.
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

export default VerifyOtp;
