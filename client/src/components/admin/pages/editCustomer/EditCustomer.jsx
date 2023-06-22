import React, { useEffect, useState } from "react";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateRoleAdmin,
  clearError,
  getSingleUserAdmin,
} from "../../../../redux/features/adminSlice";
import { toast } from "react-toastify";
import Loader from "../../../layout/loader/Loader";

const options = ["user", "admin", "superAdmin", "seller", "buyer"];

const EditCustomer = () => {
  const { loading, error, customer } = useSelector((state) => state.admin);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    role: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");

  const { fullName, email, mobileNo, role } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (customer) {
      setFormData({
        fullName: customer.fullName || "",
        email: customer.email || "",
        mobileNo: customer.mobileNo || "",
        role: customer.role || "",
      });
      setAvatarPreview(customer.avatar?.url || "");
    }
  }, [customer]);

  const handleFileInPut = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(UpdateRoleAdmin({ id, formData, navigate, toast }));
  };

  useEffect(() => {
    if (id) {
      dispatch(getSingleUserAdmin(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Form onSubmit={handleSubmit} className="product-form">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/admin/dashboard/customer-list"
          style={{ color: "black", marginRight: "1rem" }}
        >
          <FaArrowLeft />
        </Link>
        <h3 className="mb-4 title">Update Customer</h3>
      </div>
      <Row>
        <Col md={6}>
          <Row>
            <Col>
              <Form.Group controlId="formFullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Enter fullName"
                  value={fullName}
                  onChange={handleInputChange}
                  style={{ width: "400px", outline: "none", boxShadow: "none" }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleInputChange}
                  style={{ width: "400px", outline: "none", boxShadow: "none" }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formMobileNo">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="mobileNo"
                  placeholder="Enter mobileNo"
                  value={mobileNo}
                  onChange={handleInputChange}
                  style={{ width: "400px", outline: "none", boxShadow: "none" }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={role}
                  onChange={handleInputChange}
                  style={{ width: "400px", outline: "none", boxShadow: "none" }}
                >
                  <option value="">Select Role</option>
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <button
                className="my-2 btn btn-custom form-control"
                style={{ backgroundColor: "#2D3748", color: "white" }}
                type="submit"
              >
                {loading && <Spinner animation="border" size="sm" />}Save
              </button>
            </Col>
          </Row>
        </Col>

        <Col md={6}>
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
    </Form>
  );
};

export default EditCustomer;
