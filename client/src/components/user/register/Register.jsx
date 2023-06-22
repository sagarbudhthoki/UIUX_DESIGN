import React, { useEffect, useState } from "react";
import "./Register.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Form, Col, Row, InputGroup, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearError, register } from "../../../redux/features/authSlice";
import MetaData from "../../layout/MetaData";

const initialState = {
  fullName: "",
  mobileNo: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerValue, setRegisterValue] = useState(initialState);
  const [registerErrors, setRegisterErrors] = useState({});
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  let { fullName, mobileNo, email, password, confirmPassword } = registerValue;

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setRegisterValue({ ...registerValue, [name]: value });
  };

  const handleFileInPut = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };
  };

  const validateForm = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const mobileRegex = /^[0-9]+$/;
    let newErrors = {};
    if (!fullName) {
      newErrors.fullName = "fullName is required!";
    }
    if (!mobileNo) {
      newErrors.mobileNo = "mobileNo is required!";
    } else if (!mobileRegex.test(mobileNo)) {
      newErrors.mobileNo = "Mobile number should contain only numbers!";
    } else if (mobileNo.length !== 10) {
      newErrors.mobileNo = "mobileNo must be 10 digit!";
    }
    if (!email) {
      newErrors.email = "Email is required!";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format!";
    }
    if (!password) {
      newErrors.password = "password is required!";
    } else if (password.length < 8) {
      newErrors.password = "password must be 8 characters long!";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "confirmPassword is required!";
    } else if (confirmPassword.length < 8) {
      newErrors.confirmPassword = "confirm password must be 8 characters long!";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "password do not match!";
    }
    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.append("fullName", fullName);
    myForm.append("mobileNo", mobileNo);
    myForm.append("email", email);
    myForm.append("password", password);
    myForm.append("confirmPassword", confirmPassword);
    myForm.append("file", avatar);

    if (validateForm()) {
      dispatch(register({ myForm, navigate, toast }));
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
      <MetaData title="register" />

      <h2 className="text-center" style={{ color: "#707B8E" }}>
        Create your HamroShop Account
      </h2>
      <div className="form-container">
        <Row>
          <Col sm={8}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Enter fullName"
                  value={fullName}
                  onChange={handleInputChange}
                  style={{ outline: "none", boxShadow: "none" }}
                />
                {registerErrors.fullName && (
                  <span style={{ color: "red" }}>
                    {registerErrors.fullName}
                  </span>
                )}
              </Form.Group>
              <Form.Group controlId="mobileNo">
                <Form.Label>Mobile No</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    name="mobileNo"
                    placeholder="+977"
                    value={mobileNo}
                    onChange={handleInputChange}
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                </InputGroup>
                {registerErrors.mobileNo && (
                  <span style={{ color: "red" }}>
                    {registerErrors.mobileNo}
                  </span>
                )}
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleInputChange}
                  style={{ outline: "none", boxShadow: "none" }}
                />
                {registerErrors.email && (
                  <span style={{ color: "red" }}>{registerErrors.email}</span>
                )}
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={handleInputChange}
                    style={{
                      paddingRight: "40px",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  />
                  <Button
                    variant="link"
                    onClick={handleShowPasswordToggle}
                    className="show-password-toggle position-absolute  top-50 translate-middle-y"
                    style={{ right: "10px" }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </Button>
                  {registerErrors.password && (
                    <span style={{ color: "red" }}>
                      {registerErrors.password}
                    </span>
                  )}
                </div>
              </Form.Group>
              <Form.Group controlId="Confirm password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Enter confirm password"
                  value={confirmPassword}
                  onChange={handleInputChange}
                  style={{ outline: "none", boxShadow: "none" }}
                />
                {registerErrors.confirmPassword && (
                  <span style={{ color: "red" }}>
                    {registerErrors.confirmPassword}
                  </span>
                )}
              </Form.Group>
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
                className="my-2 btn btn-custom form-control"
                style={{ backgroundColor: "#2D3748", color: "white" }}
                type="submit"
                disabled={!termsChecked}
              >
                {loading && <Spinner animation="border" size="sm" />}Register
              </button>
              <p>
                Already have an account?
                <Link
                  style={{ textDecoration: "none", color: "#707B8E" }}
                  to="/login"
                >
                  Log In
                </Link>
              </p>
            </Form>
          </Col>

          <Col
            sm={4}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="image-upload">
              <label htmlFor="imgFile" className="image-upload-label">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="profile"
                    className="image-preview"
                  />
                ) : (
                  <span>Select Image</span>
                )}
              </label>
              <Form.Control
                id="imgFile"
                type="file"
                name="file"
                accept="image/*"
                className="image-upload-input"
                onChange={handleFileInPut}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Register;
