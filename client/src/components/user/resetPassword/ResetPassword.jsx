import React, { useEffect, useState } from "react";
import Forgot from "../../../images/Forgot.png";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import MetaData from "../../layout/MetaData";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearError, passwordReset } from "../../../redux/features/authSlice";

const ResetPassword = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [resetValue, setResetValue] = useState({
    otp: "",
    newPassword: "",
  });

  const { otp, newPassword } = resetValue;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setResetValue({ ...resetValue, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error("filled must be filled!");
    dispatch(passwordReset({ resetValue, navigate, toast }));
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <MetaData title="reset password" />
      <div className="container my-5">
        <Row className="justify-content-center">
          <Col md={6} className="mb-4 mb-md-0">
            <img src={Forgot} alt="Reset Password" className="img-fluid" />
          </Col>
          <Col md={6} className="d-flex flex-column justify-content-center">
            <h2 style={{ color: "#707B8E" }}>Reset your password?</h2>

            <Form onSubmit={handleSubmit} className="">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>otp</Form.Label>
                <Form.Control
                  type="text"
                  name="otp"
                  placeholder="Enter otp"
                  value={otp}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                />

                <Form.Label>new Password</Form.Label>
                <Form.Control
                  type="password"
                  name="newPassword"
                  placeholder="Enter newPassword"
                  value={newPassword}
                  onChange={handleChange}
                  style={{ outline: "none", boxShadow: "none" }}
                />
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

export default ResetPassword;
