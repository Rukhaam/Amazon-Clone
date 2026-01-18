import React, { useState, useRef, useEffect } from "react";
import { logo } from "../../src/assets";
import LocationOnOutlineIcon from "@mui/icons-material/LocationOnOutlined";
import { ArrowDropDownOutlined, ShoppingCart } from "@mui/icons-material";
import { Search } from "@mui/icons-material";
import { allItems } from "../../constants";
import BottomHeader from "./bottomHeader.component";

const Header = () => {
  const [show, setShow] = useState(false);
  const ref = useRef(); // 1. Create the reference

  useEffect(() => {
    // 2. Event Listener Logic
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-amazon-blue sticky top-0 z-100">
      <div className=" mx-auto p-5 text-white px-4 gap-4 flex items-center">
        {/* image start here*/}
        <div className="headerHover">
          <img src={logo} alt="logo" className="w-24 mt-2" />
        </div>

        {/* deliver start here */}
        <div className="headerHover">
          <LocationOnOutlineIcon />
          <p className="text-sm text-light-text font-light flex flex-col">
            Deliver to{" "}
            <span className="text-sm font-semibold text-white-text -mt-1">
              India
            </span>
          </p>
        </div>

        {/* SearchBar start*/}
        <div className="h-10 rounded-md flex grow relative">
          {/* 3. REF CONTAINER: Wraps both the button and the menu */}
          <div ref={ref} className="relative h-full flex items-center">
            <span
              onClick={() => setShow(!show)}
              className="w-14 h-full bg-gray-200 hover:bg-gray-300 cursor-pointer duration-300 text-sm text-amazon-blue font-title-font flex items-center justify-center rounded-tl-md rounded-bl-md"
            >
              All
              <span>
                <ArrowDropDownOutlined />
              </span>
            </span>

            {show && (
              <div>
                <ul className="absolute w-56 h-80 top-10 left-0 overflow-y-scroll overflow-x-hidden bg-white border border-amazon-blue text-black p-2 flex-col gap-1 z-50">
                  {allItems.map((items) => (
                    <li
                      className="text-sm tracking-wide font-sans border-b border-b-transparent hover:border-b-amazon-blue cursor-pointer duration-200"
                      key={items._id}
                    >
                      {items.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <input
            className="h-full text-base text-amazon-blue flex grow outline-none border-none px-2 bg-white"
            type="text"
          />

          <span className="w-12 h-full flex items-center justify-center bg-amazon-yellow hover:bg-[#f3a847] duration-300 text-amazon-blue cursor-pointer rounded-tr-md rounded-br-md">
            <Search />
          </span>
        </div>
        {/* searchBar End */}

        {/* sign-in start*/}
        <div className="flex flex-col items-start justify-center headerHover">
          <p className="text-xs text-light-text font-light">Hello, Sign in</p>
          <p className="font-semibold text-sm -mt-1 text-white-text">
            Accounts & Lists{" "}
            <span>
              <ArrowDropDownOutlined />
            </span>
          </p>
        </div>

        {/* orders and returns */}
        <div className="flex flex-col items-start justify-center headerHover">
          <p className="text-xs text-light-text font-light">Returns</p>
          <p className="font-semibold text-1xl -mt-1 text-white">& Orders</p>
        </div>

        {/* carts start */}
        <div className="flex flex-col flex-start justify-center headerHover relative">
          <ShoppingCart />
          <p className="text-xs text-light font-light">
            Cart{" "}
            <span className="absolute text-xs -top-2 left-4 font-semibold p-1 h-4 bg-[#f3a847] text-amazon-blue rounded-full flex items-center justify-center">
              0
            </span>
          </p>
        </div>
      </div>
      <BottomHeader />
    </div>
  );
};

export default Header;
