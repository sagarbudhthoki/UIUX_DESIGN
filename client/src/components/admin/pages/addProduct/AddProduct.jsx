import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FaArrowLeft } from "react-icons/fa";
import { Form } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import CustomInput from "../../../customInput/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  clearError,
  createProduct,
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

const initialState = {
  productName: "",
  description: "",
  category: "",
  SKU: "",
  manufacturer: "",
  ratings: "",
  IsInStock: "",
  price: "",
};
const AddProduct = () => {
  const { error, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addProductValue, setAddProductValue] = useState(initialState);
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
  } = addProductValue;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setAddProductValue({ ...addProductValue, [name]: value });
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
    setAddProductValue({ ...addProductValue, description: value });
  };
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
    const strippedDescription = addProductValue.description
      .replace(/<\/?p>/gi, "")
      .replace(/<br\s*\/?>/gi, "");
    const myForm = new FormData();
    myForm.append("productName", productName);
    myForm.append("description", strippedDescription);
    myForm.append("SKU", SKU);
    myForm.append("category", category);
    myForm.append("manufacturer", manufacturer);
    myForm.append("ratings", ratings);
    myForm.append("IsInStock", IsInStock);
    myForm.append("price", price);
    myForm.append("file", productImg);

    if (validateForm()) {
      dispatch(createProduct({ myForm, navigate, toast }));
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
    <>
      <form onSubmit={handleSubmit} className="product-form">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/admin/dashboard/product-list"
            style={{ color: "black", marginRight: "1rem" }}
          >
            <FaArrowLeft />
          </Link>
          <h3 className="mb-4 title">Add Product</h3>
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
                value={addProductValue.description}
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
              style={{ width: "400px", outline: "none", boxShadow: "none" }}
            >
              <option value={category}>Select product Category</option>
              {options &&
                options.map((option) => <option key={option}>{option}</option>)}
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
          {loading && <Spinner animation="border" size="sm" />}Add Product
        </button>
      </form>
    </>
  );
};

export default AddProduct;
