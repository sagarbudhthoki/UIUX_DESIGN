import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Change from "../../../images/ChangePassword.png";
import { toast } from "react-toastify";
import { changePassword, clearError } from "../../../redux/features/authSlice";

const initialState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};
const ChangePassword = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordValue, setPasswordValue] = useState(initialState);
  const [passwordErrors, setPasswordErrors] = useState({});

  const { oldPassword, newPassword, confirmPassword } = passwordValue;
  const handleChange = (e) => {
    let { name, value } = e.target;
    setPasswordValue({ ...passwordValue, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!oldPassword) {
      newErrors.oldPassword = "oldPassword is required!";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "confirmPassword is required!";
    }
    if (!newPassword) {
      newErrors.newPassword = "newPassword is required!";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "password must be 8 characters long!";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "password must be match!";
    }
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (oldPassword && newPassword && confirmPassword) {
        dispatch(changePassword({ passwordValue, navigate, toast }));
      }
    } else {
      return toast.error("Invalid Input!");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <Container className="my-5">
      <div className="border rounded p-3 change-password-container">
        <Row className="justify-content-center">
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center"
          >
            <img src={Change} alt="Change Pic" className="img-fluid" />
          </Col>
          <Col md={6}>
            <h3
              className="change-password-heading"
              style={{ color: "#707B8E" }}
            >
              Change Password
            </h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="oldPassword">
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter old password"
                  value={oldPassword}
                  name="oldPassword"
                  onChange={handleChange}
                  className="change-password-input"
                  style={{ outline: "none", boxShadow: "none" }}
                />
                {passwordErrors && (
                  <span style={{ color: "red" }}>
                    {passwordErrors.oldPassword}
                  </span>
                )}
              </Form.Group>
              <Form.Group controlId="newPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  name="newPassword"
                  onChange={handleChange}
                  className="change-password-input"
                  style={{ outline: "none", boxShadow: "none" }}
                />
                {passwordErrors && (
                  <span style={{ color: "red" }}>
                    {passwordErrors.newPassword}
                  </span>
                )}
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                  className="change-password-input"
                  style={{ outline: "none", boxShadow: "none" }}
                />
                {passwordErrors && (
                  <span style={{ color: "red" }}>
                    {passwordErrors.confirmPassword}
                  </span>
                )}
              </Form.Group>
              <button
                className="my-3 btn btn-custom form-control"
                style={{ backgroundColor: "#2D3748", color: "white" }}
                type="submit"
              >
                {loading && <Spinner animation="border" size="sm" />}Change
                password
              </button>
            </Form>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ChangePassword;
