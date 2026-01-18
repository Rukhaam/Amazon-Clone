import React, { useState } from "react";
import Slider from "react-slick";
import {
  bannerOne,
  bannerTwo,
  bannerThree,
  bannerFour,
  bannerFive,
} from "../../src/assets";
const Banner = () => {
  const [dotsActive, setDotsActive] = useState(0);
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (prev, next) => {
      setDotsActive(next);
    },
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "45%",
          transform: "translate(-50% -50%)",
          width: "210px",
        }}
      >
        <ul
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {" "}
          {dots}{" "}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={
            i===dotsActive?
            {
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          display: " flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          background: "#131921",
          padding: "8px  0",
          cursor: "pointer",
          border: "1px solid #f3a847",
        }:{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            display: " flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            background: "#232F3E",
            padding: "8px  0",
            cursor: "pointer",
            border: "1px solid white",
 

        }
    }
      >
        {i + 1}
      </div>
    ),
  };

  return (
    <div className="w-full ">
      <div className="w-full h-auto relative z-10" >
        <Slider {...settings}>
          <div>
            <img src={bannerOne} alt="bannerOne" ></img>
          </div>
          <div>
            <img src={bannerTwo} alt="bannerTwo"></img>
          </div>
          <div>
            <img src={bannerThree} alt="bannerThree"></img>
          </div>
          <div>
            <img src={bannerFour} alt="bannerFour"></img>
          </div>
          <div>
            <img src={bannerFive} alt="bannerFive"></img>
          </div>
        </Slider>
      </div>
    </div>
  );
};
export default Banner;
