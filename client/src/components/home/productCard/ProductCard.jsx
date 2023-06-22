import React from "react";
import "./ProductCard.css";
import Card from "react-bootstrap/Card";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const ProductCard = ({ product }) => {
  const myStyle = {
    textDecoration: "none",
    color: "gray",
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {product.productName}
    </Tooltip>
  );

  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "#ffd707",
    size: window.innerWidth < 600 ? 20 : 25,
    value: typeof product.ratings === "number" ? product.ratings : 0, // check the type of the value prop and use a default value of 0 if it's not a number
    isHalf: true,
  };

  return (
    <>
      <div className="col-md-3 col-10 mx-auto">
        <Card>
          <Link to={`/product/details/${product._id}`} style={myStyle}>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <Card.Img
                variant="top"
                src={product.productImg?.url}
                alt="HomeImg"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  transition: "transform 0.2s ease-in-out",
                }}
                className="card-img-top"
              />
            </OverlayTrigger>
            <Card.Body>
              <Card.Title className="text-center" style={{ color: "gray" }}>
                {product.productName}
              </Card.Title>
              <Card.Text
                className="text-center"
                style={{ color: "black", fontWeight: "bold" }}
              >
                Rs.{product.price}
              </Card.Text>
              <div className="d-flex justify-content-center">
                <ReactStars {...options} />
                <p>({product.numOfReviews})</p>
              </div>
            </Card.Body>
          </Link>
        </Card>
      </div>
    </>
  );
};

export default ProductCard;
