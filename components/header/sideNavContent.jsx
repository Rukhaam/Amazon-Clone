import React from "react";
import { KeyboardArrowRight } from "@mui/icons-material";

const SideNavContent = ({ title, items }) => {
  return (
    <div className="py-3 border-b border-b-gray-300">
      {title && (
        <h3 className="text-lg lg:text-xl font-bold text-black mb-1 px-6">
          {title}
        </h3>
      )}
      <ul className="text-sm lg:text-base font-medium text-gray-800">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={item.action} 
            className="flex items-center justify-between hover:bg-zinc-200 px-6 py-3 cursor-pointer transition-colors"
          >
            {item.title}
            {item.action && (
              <span className="text-gray-500">
                <KeyboardArrowRight />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNavContent;
