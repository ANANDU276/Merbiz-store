import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, MapPin, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import AuthContext from "../context/AuthContext";
import { useAddress } from "../context/AddressContext";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const MAX_ADDRESSES_PER_USER = 2;

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useContext(AuthContext);
  const {
    addresses: savedAddresses,
    loading: loadingAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddress();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 9.99;
  const taxRate = 0.08;
  const tax = (subtotal * taxRate).toFixed(2);
  const total = (subtotal + shipping + parseFloat(tax)).toFixed(2);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    paymentMethod: "Cash on Delivery",
  });

  const [saveAddress, setSaveAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [expandedSection, setExpandedSection] = useState({
    contact: true,
    shipping: true,
    payment: true
  });
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  useEffect(() => {
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const toggleSection = (section) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (address) => {
    setSelectedAddressId(address._id);
    setForm({
      ...form,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      apartment: address.apartment || "",
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone || "",
    });
  };

  const handleSaveAddress = async () => {
    if (
      !form.firstName ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.zip
    ) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required address fields to save.",
        confirmButtonColor: "#4f46e5",
        scrollbarPadding: false,
      });
      return;
    }

    try {
      const addressData = {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        zip: form.zip,
        phone: form.phone,
        isDefault: savedAddresses.length === 0,
      };

      await addAddress(addressData);
      setSaveAddress(false);

      await Swal.fire({
        icon: "success",
        title: "Address Saved!",
        text: "Your address has been saved successfully.",
        confirmButtonColor: "#4f46e5",
        scrollbarPadding: false,
      });
    } catch (error) {
      console.error("Error saving address:", error);
      await Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text: error.message || "Failed to save address. Please try again.",
        confirmButtonColor: "#4f46e5",
        scrollbarPadding: false,
      });
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setForm({
      ...form,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      apartment: address.apartment || "",
      city: address.city,
      state: address.state,
      zip: address.zip,
      phone: address.phone || "",
    });
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress) return;

    try {
      const updatedData = {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        zip: form.zip,
        phone: form.phone,
      };

      await updateAddress(editingAddress._id, updatedData);

      await Swal.fire({
        icon: "success",
        title: "Address Updated!",
        text: "Your address has been updated successfully.",
        confirmButtonColor: "#4f46e5",
        scrollbarPadding: false,
      });

      setEditingAddress(null);
    } catch (error) {
      console.error("Error updating address:", error);
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update address. Please try again.",
        confirmButtonColor: "#4f46e5",
        scrollbarPadding: false,
      });
    }
  };

  const handleDeleteAddress = async (addressId, e) => {
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#4f46e5",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      scrollbarPadding: false,
    });

    if (result.isConfirmed) {
      try {
        await deleteAddress(addressId);
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
          setForm({
            ...form,
            firstName: "",
            lastName: "",
            address: "",
            apartment: "",
            city: "",
            state: "",
            zip: "",
            phone: "",
          });
        }
        await Swal.fire(
          "Deleted!",
          "Your address has been deleted.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting address:", error);
        await Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Failed to delete address. Please try again.",
          confirmButtonColor: "#4f46e5",
          scrollbarPadding: false,
        });
      }
    }
  };

  const showAddressLimitAlert = () => {
    Swal.fire({
      icon: "info",
      title: "Address Limit Reached",
      text: `You can only save up to ${MAX_ADDRESSES_PER_USER} addresses. Please delete an existing one to add a new address.`,
      confirmButtonColor: "#4f46e5",
      scrollbarPadding: false,
    });
  };

  const handleOrder = async () => {
    if (
      !form.email ||
      !form.firstName ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.zip
    ) {
      await Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all required fields.",
        confirmButtonColor: "#4f46e5",
        scrollbarPadding: false,
      });
      return;
    }

    if (saveAddress && user) {
      if (savedAddresses.length >= MAX_ADDRESSES_PER_USER) {
        showAddressLimitAlert();
        return;
      }
      await handleSaveAddress();
    }

    const baseOrderData = {
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.image[0],
        price: item.price,
        quantity: item.quantity,
      })),
      email: form.email,
      shippingAddress: {
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        zip: form.zip,
        phone: form.phone,
      },
      paymentMethod: form.paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
    };

    if (form.paymentMethod === "Cash on Delivery") {
      const orderData = {
        ...baseOrderData,
        paymentStatus: "Cash on Delivery",
      };

      try {
        await createOrder(orderData);
        clearCart();
        localStorage.removeItem("cart");

        await Swal.fire({
          icon: "success",
          title: "Order Placed!",
          html: `
            <div class="text-center">
              <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p class="text-lg font-medium mb-2">Your order has been placed successfully!</p>
              <p class="text-gray-600">You'll receive a confirmation email shortly.</p>
            </div>
          `,
          confirmButtonColor: "#4f46e5",
          scrollbarPadding: false,
        });

        navigate("/ordersuccess", { state: { order: orderData } });
      } catch (err) {
        console.error("Order error:", err);
        await Swal.fire({
          icon: "error",
          title: "Order Failed",
          text: "Failed to place order. Please try again.",
          confirmButtonColor: "#4f46e5",
          scrollbarPadding: false,
        });
      }
    } else if (form.paymentMethod === "Online Payment") {
      try {
        const res = await fetch(`${API_BASE_URL}/payment/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ total }),
        });

        const data = await res.json();

        const options = {
          key: "rzp_test_McyqweXXfGvPEA",
          amount: data.amount,
          currency: "INR",
          name: "Your Store Name",
          description: "Order Payment",
          order_id: data.id,
          handler: async function (response) {
            try {
              const verifyRes = await fetch(
                `${API_BASE_URL}/payment/verify-payment`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                }
              );

              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                const orderData = {
                  ...baseOrderData,
                  paymentStatus: "Paid",
                  paymentId: response.razorpay_payment_id,
                };

                await createOrder(orderData);
                clearCart();
                localStorage.removeItem("cart");

                await Swal.fire({
                  icon: "success",
                  title: "Payment Verified!",
                  text: "Your payment has been verified and order placed successfully.",
                  confirmButtonColor: "#4f46e5",
                  scrollbarPadding: false,
                });

                navigate("/ordersuccess");
              } else {
                await Swal.fire({
                  icon: "error",
                  title: "Verification Failed",
                  text: "Payment verification failed. Order not placed.",
                  confirmButtonColor: "#4f46e5",
                  scrollbarPadding: false,
                });
              }
            } catch (err) {
              console.error("Verification error:", err);
              await Swal.fire({
                icon: "error",
                title: "Verification Error",
                text: "Could not verify payment. Please contact support.",
                confirmButtonColor: "#4f46e5",
                scrollbarPadding: false,
              });
            }
          },
          prefill: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            contact: form.phone,
          },
          theme: {
            color: "#4f46e5",
          },
          modal: {
            ondismiss: async function() {
              await Swal.fire({
                icon: "info",
                title: "Payment Cancelled",
                text: "You cancelled the payment process. Your order was not placed.",
                confirmButtonColor: "#4f46e5",
                scrollbarPadding: false,
              });
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Payment error:", err);
        await Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "Failed to initiate payment. Please try again.",
          confirmButtonColor: "#4f46e5",
          scrollbarPadding: false,
        });
      }
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-10 mx-auto max-w-7xl bg-gray-50 min-h-screen"
    >
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center text-sm text-gray-500 mb-8"
      >
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-indigo-600 transition-colors">
          Cart
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Checkout</span>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {user && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                  <MapPin size={18} className="text-indigo-600" />
                  Saved Addresses {savedAddresses.length}/{MAX_ADDRESSES_PER_USER}
                </h2>
                {savedAddresses.length > 0 && (
                  <button
                    onClick={() => toggleSection('addresses')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedSection.addresses ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                )}
              </div>
              
              <AnimatePresence>
                {(!expandedSection.hasOwnProperty('addresses') || expandedSection.addresses ? (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                  >
                    {loadingAddresses ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : savedAddresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedAddresses.map((address) => (
                          <motion.div
                            key={address._id}
                            variants={itemVariants}
                            className={`p-4 rounded-lg transition-all cursor-pointer
                              ${selectedAddressId === address._id 
                                ? "border-2 border-indigo-500 bg-indigo-50" 
                                : "border border-gray-200 hover:border-gray-300"}`}
                            onClick={() => handleSelectAddress(address)}
                          >
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {address.firstName} {address.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {address.address}
                                {address.apartment && `, ${address.apartment}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.state} {address.zip}
                              </p>
                              {address.phone && (
                                <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                              )}
                              {address.isDefault && (
                                <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex justify-end gap-2 mt-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAddress(address);
                                }}
                                className="text-indigo-600 hover:text-indigo-800 p-1"
                                title="Edit address"
                              >
                                <Edit size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => handleDeleteAddress(address._id, e)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete address"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        You don't have any saved addresses yet.
                      </p>
                    )}
                  </motion.div>
                ) : null)}
              </AnimatePresence>
            </motion.div>
          )}

          <AnimatePresence>
            {editingAddress && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4 border border-gray-200"
                >
                  <h3 className="font-semibold text-lg mb-4 text-gray-800">Edit Address</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={form.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={form.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={form.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Apartment (optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={form.apartment}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={form.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={form.state}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          ZIP *
                        </label>
                        <input
                          type="text"
                          name="zip"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={form.zip}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setEditingAddress(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleUpdateAddress}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('contact')}
            >
              <h2 className="font-semibold text-lg text-gray-800">Contact Information</h2>
              {expandedSection.contact ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>
            
            <AnimatePresence>
              {expandedSection.contact && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, height: 0 },
                    show: { opacity: 1, height: 'auto' }
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('shipping')}
            >
              <h2 className="font-semibold text-lg text-gray-800">Shipping Address</h2>
              {expandedSection.shipping ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>
            
            <AnimatePresence>
              {expandedSection.shipping && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, height: 0 },
                    show: { opacity: 1, height: 'auto' }
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name*"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address*"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apartment, suite, etc. (optional)"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={form.apartment}
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City*"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State*"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="text"
                      name="zip"
                      placeholder="ZIP Code*"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={form.zip}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (optional)"
                    className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={form.phone}
                    onChange={handleChange}
                  />

                  {user && (
                    <div className="mt-4 flex items-center">
                      <input
                        type="checkbox"
                        id="saveAddress"
                        checked={saveAddress}
                        onChange={(e) => {
                          if (
                            e.target.checked &&
                            savedAddresses.length >= MAX_ADDRESSES_PER_USER
                          ) {
                            showAddressLimitAlert();
                            setSaveAddress(false);
                          } else {
                            setSaveAddress(e.target.checked);
                          }
                        }}
                        className="mr-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="saveAddress" className="text-sm text-gray-600">
                        Save this address for future use
                      </label>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('payment')}
            >
              <h2 className="font-semibold text-lg text-gray-800">Payment Method</h2>
              {expandedSection.payment ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </div>
            
            <AnimatePresence>
              {expandedSection.payment && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0, height: 0 },
                    show: { opacity: 1, height: 'auto' }
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-3 mt-4">
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={form.paymentMethod === "Cash on Delivery"}
                        onChange={handleChange}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div>
                        <span className="font-medium text-gray-800">Cash on Delivery</span>
                        <p className="text-sm text-gray-500 mt-1">Pay with cash upon delivery</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online Payment"
                        checked={form.paymentMethod === "Online Payment"}
                        onChange={handleChange}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <div>
                        <span className="font-medium text-gray-800">Online Payment (Razorpay)</span>
                        <p className="text-sm text-gray-500 mt-1">Pay securely with Razorpay</p>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:w-1/3"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
            <h2 className="font-semibold text-xl mb-6 text-gray-800">
              Order Summary
            </h2>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-600">Your cart is empty.</p>
            ) : (
              <>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <motion.div 
                      key={item._id} 
                      className="flex justify-between items-start"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          ₹{item.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 border-t pt-4 text-sm text-gray-700 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-800">₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-800">₹{tax}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-3 text-base mt-3">
                    <span className="text-gray-800">Total</span>
                    <span className="text-gray-900">₹{total}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOrder}
                  disabled={cart.length === 0}
                  className={`w-full mt-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors ${
                    cart.length === 0
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  <Check size={18} className="mr-2" />
                  Complete Order
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default Checkout;