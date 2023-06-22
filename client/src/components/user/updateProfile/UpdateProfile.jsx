import React, { useEffect, useState } from "react";
import "./UpdateProfile.css";
import { Form, Col, Row, InputGroup, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearError, profileUpdate } from "../../../redux/features/authSlice";

const UpdateProfile = () => {
  const { loading, error, singleUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updateValue, setUpdateValue] = useState({
    fullName: singleUser?.fullName || "",
    mobileNo: singleUser?.mobileNo || "",
    email: singleUser?.email || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(singleUser?.avatar?.url);
  const [avatar, setAvatar] = useState("");

  const { fullName, email, mobileNo } = updateValue;

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setUpdateValue({ ...updateValue, [name]: value });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const updateForm = new FormData();
    updateForm.append("fullName", fullName);
    updateForm.append("mobileNo", mobileNo);
    updateForm.append("email", email);
    updateForm.append("file", avatar);

    dispatch(profileUpdate({ updateForm, navigate, toast }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <h2 className="text-center" style={{ color: "#707B8E" }}>
        Update your Profile
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
              </Form.Group>

              <button
                className="my-2 btn btn-custom form-control"
                style={{ backgroundColor: "#2D3748", color: "white" }}
                type="submit"
              >
                {loading && <Spinner animation="border" size="sm" />}Update
              </button>
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

export default UpdateProfile;
