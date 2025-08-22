import React, { useEffect, useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import Swal from "sweetalert2";
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
  FiDollarSign,
  FiShoppingBag,
  FiRefreshCw,
  FiMapPin,
  FiUser,
  FiHome,
  FiPhone,
  FiCreditCard,
  FiArrowLeft,
  FiMessageSquare,
  FiHelpCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useContext(AuthContext);
  const {
    orders,
    getOrderById,
    loading,
    requestReturn,
    returnLoading,
    fetchOrders,
  } = useOrders();
  const [order, setOrder] = useState(null);
  const [activeReturnOrder, setActiveReturnOrder] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    if (orders.length > 0) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    }
  }, [orders, orderId]);

  const handleReturnRequest = async (orderId, itemId) => {
    const { value: reason } = await Swal.fire({
      title: "Return Request",
      input: "textarea",
      inputPlaceholder: "Reason for return...",
      inputAttributes: {
        "aria-label": "Type your reason for return here",
      },
      showCancelButton: true,
      confirmButtonText: "Submit Request",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      preConfirm: (val) => {
        if (!val) {
          Swal.showValidationMessage("Please provide a reason");
        }
        return val;
      },
    });

    if (reason) {
      try {
        setActiveReturnOrder(`${orderId}-${itemId}`);
        await requestReturn(orderId, itemId, reason);
        Swal.fire({
          title: "Request Submitted",
          text: "Your return request has been submitted successfully",
          icon: "success",
          confirmButtonColor: "#4f46e5",
        });
        await fetchOrders(user.email);
        const updatedOrder = getOrderById(orderId);
        setOrder(updatedOrder);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to submit return request",
          icon: "error",
          confirmButtonColor: "#4f46e5",
        });
      } finally {
        setActiveReturnOrder(null);
      }
    }
  };

  const canRequestReturn = (item, orderDateStr) => {
    if (!item) return false;
    if (item.returnRequest?.requested) return false;
    const returnWindowDays = 30;
    const orderDate = new Date(orderDateStr);
    const returnDeadline = new Date(
      orderDate.setDate(orderDate.getDate() + returnWindowDays)
    );
    return new Date() <= returnDeadline;
  };

  const getOrderStatusDetails = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return {
          color: "bg-blue-100 text-blue-700",
          icon: <FiRefreshCw className="mr-2 animate-spin" />,
          text: "Processing",
          description: "Your order is being prepared for shipment",
        };
      case "shipped":
        return {
          color: "bg-purple-100 text-purple-700",
          icon: <FiTruck className="mr-2" />,
          text: "Shipped",
          description: "Your order is on its way",
        };
      case "delivered":
        return {
          color: "bg-green-100 text-green-700",
          icon: <FiCheckCircle className="mr-2" />,
          text: "Delivered",
          description: "Your order has been delivered",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700",
          icon: <FiXCircle className="mr-2" />,
          text: "Cancelled",
          description: "Your order has been cancelled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700",
          icon: <FiClock className="mr-2" />,
          text: "Pending",
          description: "Your order is being processed",
        };
    }
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse flex flex-col items-center"
        >
          <div className="h-12 w-12 bg-gray-100 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-48"></div>
        </motion.div>
      </div>
    );
  }

  const items = order.items || [];
  const itemTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = order.shipping || 0;
  const tax = order.tax || 0;
  const grandTotal = order.total || itemTotal + shipping + tax;
  const statusDetails = getOrderStatusDetails(order.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link
          to="/myorders"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
        >
          <FiArrowLeft className="mr-2" />
          Back to My Orders
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <div className="mt-2 flex items-center space-x-4">
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDetails.color}`}
            >
              {statusDetails.icon}
              {statusDetails.text}
            </motion.span>
            <p className="text-gray-600">
              Order #<span className="font-medium">{order._id.slice(18,25)}</span>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">
                Order Status
              </h2>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-100"></div>

                {/* Order Placed */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="relative pb-8"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      <FiShoppingBag className="h-4 w-4" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Order Placed
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Processing */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="relative pb-8"
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
                      ${
                        ["processing", "shipped", "delivered"].includes(
                          order.status.toLowerCase()
                        )
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <FiRefreshCw className="h-4 w-4" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Processing
                      </h3>
                      {order.status.toLowerCase() === "processing" && (
                        <p className="text-sm text-gray-500">
                          Your order is being prepared
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Shipped */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="relative pb-8"
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
                      ${
                        ["shipped", "delivered"].includes(
                          order.status.toLowerCase()
                        )
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <FiTruck className="h-4 w-4" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Shipped
                      </h3>
                      {order.status.toLowerCase() === "shipped" &&
                        order.shippingDate && (
                          <p className="text-sm text-gray-500">
                            Shipped on{" "}
                            {new Date(order.shippingDate).toLocaleDateString()}
                          </p>
                        )}
                    </div>
                  </div>
                </motion.div>

                {/* Delivered */}
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="relative"
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
                      ${
                        order.status.toLowerCase() === "delivered"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <FiCheckCircle className="h-4 w-4" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Delivered
                      </h3>
                      {order.status.toLowerCase() === "delivered" &&
                        order.deliveryDate && (
                          <p className="text-sm text-gray-500">
                            Delivered on{" "}
                            {new Date(order.deliveryDate).toLocaleDateString()}
                          </p>
                        )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">
                Order Items ({items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 h-24 w-24 bg-gray-50 rounded-md overflow-hidden">
                        {item.image ? (
                          <img
                            className="h-full w-full object-cover"
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-300">
                            <FiPackage size={24} />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              <Link
                                to={`/products/${item.productId}`}
                                className="hover:text-indigo-600 transition-colors"
                              >
                                {item.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.variant || "Standard"}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <p className="text-base font-medium text-gray-900">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Per-item return logic */}
                        {item.returnRequest?.requested ? (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3 bg-blue-50 p-3 rounded-md"
                          >
                            <div className="flex items-start">
                              <FiMessageSquare className="flex-shrink-0 mt-0.5 mr-2 text-blue-500" />
                              <div>
                                <p className="text-sm">
                                  <strong>Reason:</strong>{" "}
                                  {item.returnRequest.reason}
                                </p>
                                <p className="text-sm mt-1">
                                  <strong>Status:</strong>{" "}
                                  <ReturnStatusBadge
                                    status={item.returnRequest.status}
                                  />
                                </p>
                                <p className="text-sm mt-1">
                                  <strong>Requested on:</strong>{" "}
                                  {new Date(
                                    item.returnRequest.requestedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ) : canRequestReturn(item, order.createdAt) ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleReturnRequest(order._id, item._id)
                            }
                            disabled={
                              returnLoading &&
                              activeReturnOrder === `${order._id}-${item._id}`
                            }
                            className="mt-3 px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {returnLoading &&
                            activeReturnOrder === `${order._id}-${item._id}`
                              ? "Processing..."
                              : "Request Return"}
                          </motion.button>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Need Help Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">Need Help?</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start">
                <FiHelpCircle
                  className="flex-shrink-0 mt-1 mr-3 text-indigo-500"
                  size={20}
                />
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Customer Support
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Have questions about your order? Our customer support team
                    is here to help.
                  </p>
                  <div className="mt-3">
                    <a
                      href="mailto:support@example.com"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FiMapPin className="mr-2 text-indigo-500" />
                Delivery Address
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">
                  {order.shippingAddress?.name || user?.name}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress?.state},{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress?.country}
                </p>
                <p className="text-gray-600 flex items-center">
                  <FiPhone className="mr-2" />
                  {order.shippingAddress?.phone || user?.phone}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Method */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FiCreditCard className="mr-2 text-indigo-500" />
                Payment Method
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <FiCreditCard className="text-gray-500" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">
                    {order.paymentMethod}
                  </p>
                  {order.paymentMethod === "Credit Card" && (
                    <p className="text-gray-600 text-sm">
                      Ending with •••• {order.paymentDetails?.last4}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Payment Status:</span>{" "}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                    ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FiDollarSign className="mr-2 text-indigo-500" />
                Order Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">
                    Subtotal ({items.length} items)
                  </p>
                  <p className="text-gray-900 font-medium">
                    ₹{itemTotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="text-gray-900 font-medium">
                    ₹{shipping.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax</p>
                  <p className="text-gray-900 font-medium">₹{tax.toFixed(2)}</p>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <p className="text-gray-900 font-medium">Total</p>
                  <p className="text-gray-900 font-bold">
                    ₹{grandTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900">
                Order Actions
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <FiShoppingBag className="mr-2" />
                  Buy Again
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <FiMessageSquare className="mr-2" />
                  Leave Feedback
                </motion.button>
                {order.status.toLowerCase() === "delivered" && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <FiCheckCircle className="mr-2" />
                    Track Package
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ReturnStatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  let color = "";
  let icon = null;

  switch (status.toLowerCase()) {
    case "approved":
      color = "bg-green-100 text-green-700";
      icon = <FiCheckCircle className="mr-1" />;
      break;
    case "rejected":
      color = "bg-red-100 text-red-700";
      icon = <FiXCircle className="mr-1" />;
      break;
    case "processing":
      color = "bg-blue-100 text-blue-700";
      icon = <FiRefreshCw className="mr-1" />;
      break;
    case "pending":
    default:
      color = "bg-yellow-100 text-yellow-700";
      icon = <FiClock className="mr-1" />;
      break;
  }

  return (
    <motion.span 
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={`${base} ${color}`}
    >
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  );
};

export default OrderDetails;