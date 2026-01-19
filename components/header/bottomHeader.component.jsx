import React, { useEffect, useRef, useState } from "react";
import {
  AccountCircle,
  Close,
  Menu as MenuIcon,
  ArrowBack,
} from "@mui/icons-material"; // Added ArrowBack
import { motion } from "framer-motion";
import SideNavContent from "./sideNavContent";

const BottomHeader = () => {
  const [open, setOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState("main"); // "main" | "electronics" | "computers" etc.
  const ref = useRef();

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (e.target.contains(ref.current)) {
        setOpen(false);
      }
    });
  }, [ref, open]);

  // Reset view to main when closing the sidebar
  useEffect(() => {
    if (!open) {
      setSidebarView("main");
    }
  }, [open]);

  // --- MENU DATA ---

  // 1. Digital Content Items
  const digitalContent = [
    { title: "Amazon Music", action: null },
    { title: "Kindle E-readers & Books", action: null },
    { title: "Amazon Appstore", action: null },
  ];

  // 2. Shop By Department Items (Clicking Electronics changes state)
  const shopByDepartment = [
    {
      title: "Electronics",
      action: () => setSidebarView("electronics"), // <--- TRIGGER SUB-MENU
    },
    { title: "Computers", action: null },
    { title: "Smart Home", action: null },
  ];

  // 3. Program Items
  const programs = [
    { title: "Gift Cards", action: null },
    { title: "Amazon Live", action: null },
    { title: "International Shopping", action: null },
  ];

  // 4. Help Items
  const help = [
    { title: "Your Account", action: null },
    { title: "Customer Service", action: null },
    { title: "Contact Us", action: null },
  ];

  // --- SUB-MENUS ---
  const electronicsItems = [
    { title: "Camera & Photo", action: null },
    { title: "Audio & Headphones", action: null },
    { title: "Video Games", action: null },
    { title: "Television & Video", action: null },
    { title: "Car & Vehicle Electronics", action: null },
  ];

  return (
    <div className="w-full px-4 h-9 bg-amazon-light text-white flex items-center">
      {/* Trigger Button */}
      <ul className="flex items-center gap-2 text-sm tracking-wide">
        <li className="headerHover gap-1" onClick={() => setOpen(true)}>
          <MenuIcon /> All
        </li>
        <li className="headerHover hidden md:inline-flex">Today's Deals</li>
        <li className="headerHover hidden md:inline-flex">Customer Service</li>
        <li className="headerHover hidden md:inline-flex">Gift Cards</li>
        <li className="headerHover hidden md:inline-flex">Registry</li>
        <li className="headerHover hidden md:inline-flex">Sell</li>
      </ul>

      {/* Sidebar Overlay */}
      {open && (
        <div className="w-full h-screen text-black fixed top-0 left-0 bg-amazon-blue/50 z-[50]">
          <div className="w-full h-full relative">
            <motion.div
              ref={ref}
              initial={{ x: -500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-[350px] h-full bg-white border border-black overflow-y-scroll pb-10"
            >
              <div className="w-full bg-amazon-light text-white py-3 px-5 flex items-center gap-4 text-lg font-semibold sticky top-0 z-50">
                <AccountCircle />
                <h3>Hello, Sign-In</h3>
              </div>

              {/* === MAIN MENU VIEW === */}
              {sidebarView === "main" && (
                <>
                  <SideNavContent
                    title="Digital Content & Devices"
                    items={digitalContent}
                  />
                  <SideNavContent
                    title="Shop By Departments"
                    items={shopByDepartment}
                  />
                  <SideNavContent
                    title="Programs and Features"
                    items={programs}
                  />
                  <SideNavContent title="Help and Settings" items={help} />
                </>
              )}

              {/* === ELECTRONICS SUB-MENU VIEW === */}
              {sidebarView === "electronics" && (
                <div className="w-full">
                  {/* Back Button */}
                  <div
                    onClick={() => setSidebarView("main")}
                    className="py-3 px-6 text-lg font-semibold cursor-pointer hover:bg-zinc-200 border-b border-gray-300 flex items-center gap-2"
                  >
                    <ArrowBack /> Main Menu
                  </div>

                  {/* Sub Items */}
                  <SideNavContent
                    title="Electronics"
                    items={electronicsItems}
                  />
                </div>
              )}

              {/* Close Button */}
              <span
                onClick={() => setOpen(false)}
                className="cursor-pointer absolute top-5 left-[360px] w-10 h-10 text-white flex items-center justify-center border bg-transparent hover:bg-red-500 duration-200"
              >
                <Close />
              </span>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomHeader;
