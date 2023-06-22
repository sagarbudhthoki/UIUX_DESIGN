import React, { useEffect, useState } from "react";
import { Form, Row, Col, Spinner, Table } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  ReviewDelete,
  allReviews,
  clearError,
} from "../../../../redux/features/productSlice";
import { toast } from "react-toastify";

const ReviewList = () => {
  const { loading, error, reviews } = useSelector((state) => state.product);

  const dispatch = useDispatch();
  const [productId, setProductId] = useState("");
  const [showTable, setShowTable] = useState(false); // New state to show/hide the table

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(allReviews(productId));
    setShowTable(true); // Set showTable to true when the form is submitted
  };

  const handleDeleteReview = (reviewId, productId) => {
    dispatch(ReviewDelete({ reviewId, productId, toast }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [dispatch, error]);

  return (
    <>
      <h4>All Reviews</h4>
      <Form onSubmit={handleSubmit} className="product-form">
        <Row>
          <Col>
            <Form.Group controlId="formReviews">
              <Form.Label>Search by Product Id</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Product Id"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                style={{ width: "400px", outline: "none", boxShadow: "none" }}
              />
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
              {loading && <Spinner animation="border" size="sm" />}Submit
            </button>
          </Col>
        </Row>
      </Form>

      {/* Show the table only if reviews exist and the form is submitted */}
      {showTable && (
        <>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" size="sm" />
            </div>
          ) : reviews && reviews.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Review Id</th>
                  <th>Username</th>
                  <th>Comment</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Iterate over the reviews and render a row for each one */}
                {reviews &&
                  reviews.map((review) => (
                    <tr key={review._id}>
                      <td>{review._id}</td>
                      <td>{review.fullName}</td>
                      <td>{review.comment}</td>
                      <td>{review.rating}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleDeleteReview(review._id, productId)
                          }
                          style={{
                            color: "red",
                            outline: "none",
                            border: "none",
                            background: "transparent",
                          }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center">
              {error ? <p>{error}</p> : <p>No reviews found</p>}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ReviewList;
