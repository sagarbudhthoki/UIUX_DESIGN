import React from "react";
import ReactStars from "react-rating-stars-component";
import Circle from "../../../images/circle.png";

const ReviewCard = ({ review }) => {
  const options1 = {
    edit: false,
    color: "rgba(20, 20, 20, 0.1)",
    activeColor: "#ffd707",
    size: window.innerWidth < 600 ? 20 : 25,
    isHalf: true,
    value: review.rating,
  };
  return (
    <>
      <div className="reviewCard">
        <img src={Circle} alt="User" />
        <p>{review.fullName}</p>
        <ReactStars {...options1} />
        <span className="reviewCardComment">{review.comment}</span>
      </div>
    </>
  );
};

export default ReviewCard;
