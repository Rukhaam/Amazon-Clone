import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-bodyFont">
      {/* SIDEBAR */}
    

<div className="w-64 bg-amazon-blue text-white flex flex-col p-4 gap-4">
    <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
    
    <Link to="/admin" className="hover:text-yellow-400">Dashboard Home</Link>
    
    {/* NEW LINK */}
    <Link to="/admin/add-product" className="hover:text-yellow-400 font-bold text-yellow-500">
       + Add Product
    </Link>
    
    {/* <Link to="/admin/migrate" className="hover:text-yellow-400">Migrate</Link> */}
    <Link to="/admin/products" className="hover:text-yellow-400">Manage Products</Link>
    <Link to="/admin/orders" className="hover:text-yellow-400">Manage Orders</Link>
    <Link to="/" className="mt-auto text-gray-400 hover:text-white">← Back to Site</Link>
</div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-8">
        <Outlet /> {/* This renders the sub-pages (Add Product, View Orders) */}
      </div>
    </div>
  );
};

export default AdminDashboard;