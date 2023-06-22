import React from "react";
import "./ProductDetails.css";
import { Modal, Button, Row, Col } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";

const ProductDetailsModal = ({ item, show, handleClose }) => {
  const options = {
    edit: false,
    color: "rgba(20, 20, 20, 0.1)",
    activeColor: "#ffd707",
    size: window.innerWidth < 600 ? 20 : 25,
    isHalf: true,
    value: item.ratings,
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{item.productName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <img
              src={item?.productImg?.url}
              alt={item.productName}
              className="w-100"
            />
          </Col>
          <Col md={8}>
            <h5>Description</h5>
            <p>{item.description}</p>
            <h5>Details</h5>
            <ul className="details-list">
              <li>Manufacturer: {item.manufacturer}</li>
              <li>Price: Rs.{item.price}</li>
              <li>
                Rating: <ReactStars {...options} />
              </li>
              <li>Category: {item.category}</li>
              <li>IsInStock: {item.IsInStock}</li>
              <li>SKU: {item.SKU}</li>
            </ul>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailsModal;
