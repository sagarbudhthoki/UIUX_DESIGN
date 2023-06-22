import React from "react";
import "./Contact.css";
import ContactUs from "../../images/ContactUs.png";
import MetaData from "../layout/MetaData";

const Contact = () => {
  return (
    <>
      <MetaData title="contact" />
      <div className="my-3">
        <h1 className="text-center" style={{ color: "#3498db" }}>
          Find Us
        </h1>
      </div>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="form-container">
            <input type="text" placeholder="Name" className="form-input" />
            <input type="email" placeholder="Email" className="form-input" />
            <textarea
              placeholder="Message"
              className="form-textarea"
            ></textarea>
            <button type="submit" className="form-submit">
              Send Message
            </button>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <img src={ContactUs} alt="contactUs Img" className="contact-img" />
        </div>

        <div className="map-container">
          <iframe
            title="myFrame"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3996338877023!2d85.32672314967755!3d27.704944832122024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19a74d6ee495%3A0x7f4d91c7478c536a!2sDillibazar%20Pipal%20Bot!5e0!3m2!1sen!2snp!4v1678009097589!5m2!1sen!2snp"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Contact;
