import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaArrowLeft } from "react-icons/fa";
import { Form, Spinner } from "react-bootstrap";
import CustomInput from "../../../customInput/CustomInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../layout/loader/Loader";
import {
  clearError,
  singleAdminProduct,
  updateProduct,
} from "../../../../redux/features/adminSlice";

const options = [
  "Laptop",
  "shoes",
  "Electronics",
  "statue",
  "Attire",
  "Camera",
  "SmartPhones",
];

const EditProduct = () => {
  const { error, loading, single } = useSelector((state) => state.admin);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateProductValue, setUpdateProductValue] = useState({
    productName: "",
    description: "",
    category: "",
    SKU: "",
    manufacturer: "",
    ratings: "",
    IsInStock: "",
    price: "",
  });
  const [productErrors, setProductErrors] = useState({});
  const [productImg, setProductImg] = useState("");
  const [productImgPreview, setProductImgPreview] = useState("");

  const {
    productName,
    description,
    category,
    SKU,
    manufacturer,
    ratings,
    IsInStock,
    price,
  } = updateProductValue;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setUpdateProductValue({ ...updateProductValue, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = [
      "productName",
      "description",
      "category",
      "SKU",
      "manufacturer",
      "ratings",
      "IsInStock",
      "price",
    ];
    const newErrors = {};

    const productValues = {
      productName,
      description,
      category,
      SKU,
      manufacturer,
      ratings,
      IsInStock,
      price,
    };

    requiredFields.forEach((field) => {
      if (!productValues[field]) {
        newErrors[field] = `${field} is required!`;
      }
    });

    setProductErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDescriptionChange = (value) => {
    setUpdateProductValue({ ...updateProductValue, description: value });
  };

  useEffect(() => {
    if (id) {
      dispatch(singleAdminProduct(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (single) {
      setUpdateProductValue({
        productName: single.productName || "",
        description: single.description || "",
        category: single.category || "",
        SKU: single.SKU || "",
        manufacturer: single.manufacturer || "",
        ratings: single.ratings || "",
        IsInStock: single.IsInStock || "",
        price: single.price || "",
      });
      setProductImgPreview(single.productImg?.url || "");
    }
  }, [single]);

  const handleFileInPut = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProductImgPreview(reader.result);
      setProductImg(file);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("productName", productName);
    myForm.append("description", description);
    myForm.append("SKU", SKU);
    myForm.append("category", category);
    myForm.append("manufacturer", manufacturer);
    myForm.append("ratings", ratings);
    myForm.append("IsInStock", IsInStock);
    myForm.append("price", price);
    myForm.append("file", productImg);

    if (validateForm()) {
      dispatch(updateProduct({ id, myForm, navigate, toast }));
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

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="product-form">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/admin/dashboard/product-list"
            style={{ color: "black", marginRight: "1rem" }}
          >
            <FaArrowLeft />
          </Link>
          <h3 className="mb-4 title">Edit Product</h3>
        </div>
        <div className="row">
          <div className="col-md-6">
            <CustomInput
              type="text"
              name="productName"
              label="Enter Product Name"
              value={productName}
              onChange={handleChange}
            />
            {productErrors && (
              <span style={{ color: "red" }}>{productErrors.productName}</span>
            )}
            <CustomInput
              type="text"
              name="SKU"
              label="Enter SKU"
              value={SKU}
              onChange={handleChange}
            />
            {productErrors && (
              <span style={{ color: "red" }}>{productErrors.SKU}</span>
            )}

            <CustomInput
              type="text"
              name="manufacturer"
              label="Enter Manufacturer"
              value={manufacturer}
              onChange={handleChange}
            />
            {productErrors && (
              <span style={{ color: "red" }}>{productErrors.manufacturer}</span>
            )}

            <CustomInput
              type="number"
              name="ratings"
              label="Enter ratings"
              value={ratings}
              onChange={handleChange}
            />
            {productErrors && (
              <span style={{ color: "red" }}>{productErrors.ratings}</span>
            )}

            <CustomInput
              type="number"
              name="IsInStock"
              label="Enter IsInStock"
              value={IsInStock}
              onChange={handleChange}
            />
            {productErrors && (
              <span style={{ color: "red" }}>{productErrors.IsInStock}</span>
            )}

            <CustomInput
              type="number"
              name="price"
              label="Enter Product price"
              value={price}
              onChange={handleChange}
            />
            {productErrors && (
              <span style={{ color: "red" }}>{productErrors.price}</span>
            )}
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <ReactQuill
                theme="snow"
                value={updateProductValue.description}
                onChange={handleDescriptionChange}
              />
              {productErrors && (
                <span style={{ color: "red" }}>
                  {productErrors.description}
                </span>
              )}
            </div>
            <select
              name="category"
              className="form-control py-3 mb-3"
              id="category"
              onChange={handleChange}
              value={updateProductValue.category}
              style={{ width: "400px", outline: "none", boxShadow: "none" }}

              // add this line to set the selected value
            >
              <option value="">Select product category</option>
              {options &&
                options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
            {productErrors && (
              <p style={{ color: "red" }}>{productErrors.category}</p>
            )}
            <div className="image-upload">
              <label htmlFor="imgFile" className="image-upload-label">
                {productImgPreview ? (
                  <img
                    src={productImgPreview}
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
          </div>
        </div>
        <button
          className="my-2 btn btn-custom form-control"
          style={{ backgroundColor: "#2D3748", color: "white" }}
          type="submit"
        >
          {loading && <Spinner animation="border" size="sm" />}Edit Product
        </button>
      </form>
    </>
  );
};

export default EditProduct;
