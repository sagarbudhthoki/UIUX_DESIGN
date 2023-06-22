import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CustomerDetailsModal = ({ customer, show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{customer.fullName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={4}>
            <img
              src={customer?.avatar?.url}
              alt={customer.fullName}
              className="w-100"
            />
          </Col>
          <Col md={8}>
            <h5>FullName</h5>
            <p>{customer.fullName}</p>
            <h5>Details</h5>
            <ul className="details-list">
              <li>email:{customer.email}</li>
              <li>Mobile:{customer.mobileNo}</li>
              <li>Role:{customer.role}</li>
              <li>
                Verified:
                {customer?.verified ? (
                  <FaCheckCircle style={{ color: "green" }} />
                ) : (
                  <FaTimesCircle style={{ color: "red" }} />
                )}
              </li>
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

export default CustomerDetailsModal;
