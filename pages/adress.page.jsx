import React, { useState } from "react";
import { useAddress } from "../src/context/adresses.context";
import AddIcon from "@mui/icons-material/Add";

const AddressPage = () => {
  const { addresses, saveAddress, deleteAddress } = useAddress();
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    zip: "",
    country: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveAddress(formData);
    if (success) {
      setShowForm(false);
      setFormData({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        zip: "",
        country: "",
      });
    }
  };

  return (
    <div className="w-full bg-white min-h-screen p-8 font-bodyFont">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb / Title */}
        <h1 className="text-3xl font-light mb-6">Your Addresses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. ADD ADDRESS TILE */}
          <div
            onClick={() => setShowForm(true)}
            className="h-[260px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AddIcon style={{ fontSize: 50 }} />
            <h2 className="text-xl font-bold mt-2">Add Address</h2>
          </div>

          {/* 2. SAVED ADDRESS CARDS */}
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="h-[260px] border border-gray-300 rounded-md p-6 relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Default Badge (Optional logic) */}
                {addresses[0].id === addr.id && (
                  <div className="text-xs text-gray-500 border-b pb-2 mb-2">
                    Default:{" "}
                    <span className="font-bold text-black logo">Amazon</span>
                  </div>
                )}

                <h3 className="font-bold text-base">{addr.fullName}</h3>
                <p className="text-sm mt-1">{addr.street}</p>
                <p className="text-sm">
                  {addr.city}, {addr.zip}
                </p>
                <p className="text-sm uppercase">{addr.country}</p>
                <p className="text-sm mt-2">Phone: {addr.phone}</p>
              </div>

              <div className="flex items-center gap-3 text-sm text-blue-600 mt-4">
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="hover:underline hover:text-orange-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 3. POPUP FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-full max-w-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Add a new address</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  required
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  required
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <input
                  required
                  name="street"
                  placeholder="Address Line 1"
                  value={formData.street}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                  <input
                    required
                    name="zip"
                    placeholder="Zip Code"
                    value={formData.zip}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  />
                </div>
                <input
                  required
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />

                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="bg-[#FFD814] px-4 py-2 rounded shadow-sm text-sm font-bold"
                  >
                    Add address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
