import React, { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { FaPencilAlt, FaTrash, FaEye, FaSistrix, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import {
  clearError,
  getAllProductsByAdmin,
  productDelete,
} from "../../../../redux/features/adminSlice";
import ProductDetailsModal from "./ProductDetailsModal";

const ProductList = () => {
  const { loading, error, adminProducts } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(adminProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = () => {
    // Filter adminProducts based on the search term
    const filtered = adminProducts.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Set the filtered products in state
    setFilteredProducts(filtered);
  };

  const handleDelete = (id) => {
    dispatch(productDelete({ id, toast }));
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    // Reset filtered products to adminProducts when the search term changes
    if (adminProducts.length > 0) {
      setFilteredProducts(
        adminProducts.filter(
          (product) =>
            product.productName &&
            product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      // Reset current page to 1 when search term changes
      setCurrentPage(1);
    }
  }, [searchTerm, adminProducts]);

  useEffect(() => {
    dispatch(getAllProductsByAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  // Calculate the index of the first and last item on the current page
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Select the items that should be displayed on the current page
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  //calculate the serial number for the first item on the current page
  const currentSerialNumber = (currentPage - 1) * itemsPerPage + 1;

  const hasProducts = currentItems.length > 0;

  return (
    <>
      <h4>All Products</h4>
      <div className="product-list">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="input-group w-auto">
            <input
              type="text"
              placeholder="search by product"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ outline: "none", boxShadow: "none" }}
            />
            <button
              className="btn btn-custom"
              type="button"
              style={{ backgroundColor: "#2D3748", color: "white" }}
              onClick={handleSearch}
            >
              <FaSistrix />
            </button>
          </div>
          <div>
            <Link to="/admin/dashboard/product">
              <button
                className="btn btn-custom"
                type="button"
                style={{ backgroundColor: "#2D3748", color: "white" }}
              >
                <FaPlus />
                Add Product
              </button>
            </Link>
          </div>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Product Id
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                S.N
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Product Img
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Product Name
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Category
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Manufacturer
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                SKU
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Ratings
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Is In Stock
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Price
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>
                    <Spinner animation="border" size="sm" />
                  </td>
                </tr>
              </>
            ) : (
              <>
                {currentItems && currentItems.length > 0 ? (
                  currentItems &&
                  currentItems.map((item, index) => (
                    <>
                      <tr key={item._id}>
                        <td>{item._id}</td>
                        <td>{currentSerialNumber + index}</td>
                        <td>
                          <img
                            src={item?.productImg?.url}
                            alt={item?.productName}
                            height={50}
                          />
                        </td>
                        <td>{item?.productName}</td>
                        <td>{item?.category}</td>
                        <td>{item?.manufacturer}</td>
                        <td>{item?.SKU}</td>
                        <td>{item?.ratings}</td>
                        <td
                          style={{
                            color: item?.IsInStock > 0 ? "green" : "red",
                          }}
                        >
                          {item?.IsInStock > 0 ? "Yes" : "Out of stock"}
                        </td>
                        <td>Rs.{item?.price}</td>
                        <td>
                          <Link
                            to={`/admin/dashboard/single/product/edit/${item._id}`}
                          >
                            <FaPencilAlt />
                          </Link>
                          <Link
                            onClick={() => handleDelete(item._id)}
                            style={{ color: "red" }}
                          >
                            <FaTrash />
                          </Link>
                          <Link
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowModal(true);
                            }}
                          >
                            <FaEye />
                          </Link>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <>
                    <tr>
                      <td colSpan={9} style={{ textAlign: "center" }}>
                        No data found.
                      </td>
                    </tr>
                  </>
                )}
              </>
            )}
          </tbody>
        </Table>

        {hasProducts && (
          <div className="d-flex justify-content-end mt-3">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={filteredProducts.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        )}
        {selectedProduct && (
          <ProductDetailsModal
            item={selectedProduct}
            show={showModal}
            handleClose={handleModalClose}
          />
        )}
      </div>
    </>
  );
};

export default ProductList;
