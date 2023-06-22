import React from "react";

const CustomInput = (props) => {
  const { type, label, name, value, onChange, i_id, i_class } = props;
  return (
    <>
      <div className="form-floating mb-3">
        <input
          type={type}
          className={`form-control ${i_class}`}
          id={i_id}
          placeholder={label}
          name={name}
          value={value}
          onChange={onChange}
          style={{ width: "400px", outline: "none", boxShadow: "none" }}
        />
        <label htmlFor={label}>{label}</label>
      </div>
    </>
  );
};

export default CustomInput;
