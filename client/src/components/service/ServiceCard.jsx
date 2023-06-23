import React from "react";
import Card from "react-bootstrap/Card";

const ServiceCard = (props) => {
  return (
    <>
      <div className="col-md-3 col-sm-6 mb-4">
        <Card style={{ height: "370px", overflow: "hidden" }}>
          <Card.Img variant="top" src={props.cardImg} alt="HomeImg" />
          <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <Card.Text>{props.description}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default ServiceCard;
