import React from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "./Footer.css";
import FooterLogo from "../../images/Logo.png";

const Footer = () => {
  return (
    <>
      <footer className="myfooter">
        <div className="our-container">
          <div className="sec aboutus">
            <Link to="/">
              <img style={{ width: "180px" }} src={FooterLogo} alt="logo" />
            </Link>
            <p>
              𝓗𝓪𝓶𝓻𝓸𝓢𝓱𝓸𝓹 is the fastest, easiest and most convenient way to enjoy
              the best products of your favorite retailers at home, at the
              office or wherever you want to. We know that your time is valuable
              and sometimes every minute in the day counts. That’s why we
              deliver! So you can spend more time doing the things you love.
            </p>
            <ul className="sci">
              <li>
                <Link to="https://www.facebook.com/">
                  <FaIcons.FaFacebook />
                </Link>
              </li>
              <li>
                <Link to="https://twitter.com/">
                  <FaIcons.FaTwitter />
                </Link>
              </li>
              <li>
                <Link to="https://www.instagram.com/">
                  <FaIcons.FaInstagram />
                </Link>
              </li>
              <li>
                <Link to="https://www.youtube.com/">
                  <FaIcons.FaYoutube />
                </Link>
              </li>
            </ul>
          </div>
          <div className="sec quicklinks">
            <h2 style={{ color: "#3498db" }}>Quick Links</h2>
            <ul>
              <li>
                <Link to="home">Visit Us</Link>
              </li>
              <li>
                <Link to="aboutus">About Us</Link>
              </li>
              <li>
                <Link to="services">FAQ'S</Link>
              </li>
              <li>
                <Link to="contact">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div className="sec quicklinks">
            <h2 style={{ color: "#3498db" }}>Get Help</h2>
            <ul>
              <li>
                <Link to="#">Terms & Condition</Link>
              </li>
              <li>
                <Link to="#">Shipping & Return</Link>
              </li>
              <li>
                <Link to="#">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="sec contact">
            <h2 style={{ color: "#3498db" }}>Address</h2>
            <ul className="info">
              <li>
                <span>
                  <FaIcons.FaMarker className="fa fa-marker" />
                </span>
                <span>
                  Dillibazar, Kathmandu
                  <br />
                  Pipalboat, PA 19460, <br />
                  Nepal
                </span>
              </li>
              <li>
                <span>
                  <FaIcons.FaPhone className="fa fa-phone" />
                </span>
                <p>
                  <Link to="tel:+12345678900">+977 9861315260</Link>
                  <br />
                  <Link to="tel:+12345678900">+977 9861884972</Link>
                </p>
              </li>
              <li>
                <span>
                  <FaIcons.FaEnvelope className="fa fa-envelope" />
                </span>
                <p>
                  <Link to="https://mail.google.com/mail/u/0/#inbox">
                    sagarbudhathoki128@gmail.com
                  </Link>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      <div className="copyrightText">
        <p>Copyright @ 2023 Hamro Shop. All Rights Reserved.</p>
      </div>
    </>
  );
};

export default Footer;
