import React from "react";
import { KeyboardArrowRight } from "@mui/icons-material";

const SideNavContent = ({ title, items }) => {
  return (
    <div className="py-3 border-b border-b-gray-500">
      {title && (
        <h3 className="text-lg font-sans font-semibold mb-1 px-6">
          {title}
        </h3>
      )}
      <ul className="text-sm font-medium">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={item.action} // Trigger the function passed in the item (e.g. open sub-menu)
            className="flex items-center justify-between hover:bg-zinc-200 px-6 py-2 cursor-pointer"
          >
            {item.title}
            <span className="text-gray-500">
              <KeyboardArrowRight />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNavContent;
