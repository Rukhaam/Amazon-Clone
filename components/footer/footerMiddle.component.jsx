import React from "react";
import { logo } from "../../src/assets";
import LanguageIcon from "@mui/icons-material/Language";
import { middleList } from "../../constants/footerList.data";
import FooterMiddleList from "./footerMiddle.data";

const FooterMiddle = () => {
  const scrollKey = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-amazon-light text-white">
      {/* Top Part */}
      <div
        onClick={scrollKey}
        className="w-full py-3 bg-amazon-blue hover:bg-gray-600 transition-colors duration-200 cursor-pointer text-center"
      >
        <p className="text-sm font-medium">Back to top</p>
      </div>

      {/* Middle Part - Links */}
      <div className="w-full border-b border-gray-500 py-10">
        <div className="max-w-container mx-auto px-4">
          {/* Responsive Grid: 1 col (mobile), 2 cols (tablet), 4 cols (desktop) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-4 gap-8 justify-items-start md:justify-items-center">
            {middleList.map((item) => (
              <FooterMiddleList
                key={item._id}
                title={item.title}
                listItem={item.listItems}
              ></FooterMiddleList>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Part */}
      <div className="w-full flex gap-6 items-center justify-center py-6">
        <div>
          <img className="w-20 pt-3" src={logo} alt="logo" />
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 items-center justify-center border border-gray-500 hover:border-amazon-yellow cursor-pointer duration-200 px-2 py-1 rounded-sm">
            <LanguageIcon fontSize="small" />
            <p>English</p>
          </div>
          <div className="flex gap-1 items-center justify-center border border-gray-500 hover:border-amazon-yellow cursor-pointer duration-200 px-2 py-1 rounded-sm">
            <p>🇮🇳 India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterMiddle;
