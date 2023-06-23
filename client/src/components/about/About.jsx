import React from "react";
import AboutImg from "../../images/About.png";
import CommonPage from "../commonPages/CommonPage";
import MetaData from "../layout/MetaData";
import ServiceCard from "../service/ServiceCard";
import { newData } from "../service/ServiceData";

const About = () => {
  return (
    <>
      <MetaData title="about" />
      <CommonPage
        title="We Are"
        description="that we believe that shopping online should be a 
        hassle-free experience. That's why we have made it our mission 
        to provide you with the best possible shopping experience by
         offering a wide range of high-quality products at competitive prices.
          From fashion and accessories to electronics and home appliances, 
          we have something for everyone We are committed to ensuring that your
           shopping experience with us is safe, secure, and enjoyable. That's why
            we use the latest encryption technology to protect your personal and 
            payment information, and we offer a range of payment options to suit
             your needs.Thank you for choosing HamroShop as your preferred online shopping destination.
            We look forward to serving you and providing you with an exceptional shopping experience."
        btnHome="Contact Us"
        homeImg={AboutImg}
        visit="/contact"
      />

      <div className="my-5">
        <h1 className="text-center" style={{ color: "#3498db" }}>
          Services
        </h1>

        <div className="container my-5">
          <div className="row">
            {newData.map((curValue) => (
              <ServiceCard
                key={curValue.id}
                title={curValue.title}
                description={curValue.description}
                cardImg={curValue.cardImg}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
