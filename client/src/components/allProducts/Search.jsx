import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/all/products/${keyword}`);
    } else {
      navigate("/all/products");
    }
  };
  return (
    <>
      <div className="searchContainer">
        <form className="searchBox" onSubmit={searchSubmitHandler}>
          <div className="inputContainer">
            <input
              type="text"
              placeholder="Search a product.."
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="submitBtnContainer">
            <input type="submit" value="Search" />
          </div>
        </form>
      </div>
    </>
  );
};

export default Search;
