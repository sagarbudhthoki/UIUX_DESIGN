import React from "react";
import Stepper from "react-stepper-horizontal";
import "./CheckOut.css";

const CheckOutStep = ({ activeStep }) => {
  const steps = [
    {
      title: <p>Shipping Details</p>,
    },
    {
      title: <p>Confirm Order</p>,
    },
    {
      title: <p>Payment</p>,
    },
  ];
  const stepStyles = {
    boxSizing: "border-box",
  };
  const stepperStyles = {
    connectorLineColor: "tomato !important",
    activeColor: "#28a745",
    completeColor: "#28a745",
  };
  return (
    <>
      <Stepper
        steps={steps}
        activeStep={activeStep}
        style={stepStyles}
        {...stepperStyles}
      />
    </>
  );
};

export default CheckOutStep;
