import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollTop = () => {
  const [isVisible, setVisible] = useState(false);
  const gotToBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const sectionStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const scrollButton = {
    fontSize: "14px",
    width: "40px",
    height: "40px",
    color: "#fff",
    backgroundColor: "#f33066",
    boxShadow: "#f33066",
    borderRadius: "50%",
    position: "fixed",
    bottom: "10px",
    right: "20px",
    zIndex: "999",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  };

  const listenToScroll = () => {
    let heightToHidden = 250;
    const winScroll = document.ScrollTop || document.documentElement.scrollTop;
    if (winScroll > heightToHidden) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <>
      <section style={sectionStyle} className="mySection">
        {isVisible && (
          <div style={scrollButton} className="top-btn" onClick={gotToBtn}>
            <FaArrowUp className="myIcon" />
          </div>
        )}
      </section>
    </>
  );
};

export default ScrollTop;
