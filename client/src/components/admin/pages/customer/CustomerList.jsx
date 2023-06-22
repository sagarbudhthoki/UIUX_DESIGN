import React, { useEffect, useState } from "react";
import "./CustomerList.css";
import { Table, Spinner } from "react-bootstrap";
import {
  FaPencilAlt,
  FaTrash,
  FaEye,
  FaSistrix,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import moment from "moment";
import {
  RoleDeleteByAdmin,
  clearError,
  getAllUsersByAdmin,
} from "../../../../redux/features/adminSlice";
import CustomerDetailsModal from "./CustomerDetailsModal";

const CustomerList = () => {
  const { loading, error, customers } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(customers);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleSearch = () => {
    // Filter adminProducts based on the search term
    const filtered = customers.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Set the filtered products in state
    setFilteredProducts(filtered);
  };

  const handleDelete = (id) => {
    dispatch(RoleDeleteByAdmin({ id, toast }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };
  useEffect(() => {
    // Reset filtered products to adminProducts when the search term changes
    if (customers?.length > 0) {
      setFilteredProducts(
        customers?.filter(
          (customer) =>
            customer.productName &&
            customer.productName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
      // Reset current page to 1 when search term changes
      setCurrentPage(1);
    }
  }, [searchTerm, customers]);

  useEffect(() => {
    dispatch(getAllUsersByAdmin());
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
  const currentItems = filteredProducts?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const serialCurrentNumber = (currentPage - 1) * itemsPerPage + 1;

  const hasProducts = currentItems?.length > 0;

  return (
    <>
      <h4>All Customers</h4>
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
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                S.N
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                User avatar
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                full Name
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                email
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                mobile No
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Role
              </th>
              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Verified
              </th>

              <th style={{ border: "1px solid #bebebe", fontWeight: "bold" }}>
                Created At
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
                {customers && customers.length > 0 ? (
                  customers &&
                  customers.map((customer, index) => (
                    <>
                      <tr key={customer._id}>
                        <td>{serialCurrentNumber + index}</td>
                        <td>
                          <img
                            src={customer?.avatar?.url}
                            alt={customer?.fullName}
                            height={50}
                          />
                        </td>
                        <td>{customer?.fullName}</td>
                        <td>{customer?.email}</td>
                        <td>{customer?.mobileNo}</td>
                        <td>{customer?.role}</td>
                        <td>
                          {customer?.verified ? (
                            <FaCheckCircle style={{ color: "green" }} />
                          ) : (
                            <FaTimesCircle style={{ color: "red" }} />
                          )}
                        </td>

                        <td>
                          {moment(customer?.createdAt).format("YYYY-MM-DD")}
                        </td>

                        <td>
                          <Link
                            to={`/admin/dashboard/customer/edit/${customer._id}`}
                          >
                            <FaPencilAlt />
                          </Link>
                          <Link
                            onClick={() => handleDelete(customer._id)}
                            style={{ color: "red" }}
                          >
                            <FaTrash />
                          </Link>
                          <Link
                            onClick={() => {
                              setSelectedCustomer(customer);
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

        {selectedCustomer && (
          <CustomerDetailsModal
            customer={selectedCustomer}
            show={showModal}
            handleClose={handleModalClose}
          />
        )}
      </div>
    </>
  );
};

export default CustomerList;
