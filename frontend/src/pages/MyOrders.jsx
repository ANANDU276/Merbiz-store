import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
  FiDollarSign,
  FiShoppingBag,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiStar,
  FiRepeat,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const { orders, fetchOrders, loading, error } = useOrders();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [sortedBy, setSortedBy] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    }
  }, [user?.email]);

  const toggleOrderExpand = (orderId, e) => {
    e.stopPropagation();
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/myorders/${orderId}`);
  };

  const filteredOrders = orders
    ? orders
        .filter((order) => {
          const matchesSearch = 
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some(item => 
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase());
          
          const matchesStatus = statusFilter === "all" || 
            order.status.toLowerCase() === statusFilter.toLowerCase();
          
          const matchesTime = timeFilter === "all" || 
            (timeFilter === "last30" && new Date(order.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
            (timeFilter === "last6" && new Date(order.createdAt) > new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)) ||
            (timeFilter === "lastyear" && new Date(order.createdAt) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));
          
          return matchesSearch && matchesStatus && matchesTime;
        })
        .sort((a, b) => {
          if (sortedBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
          if (sortedBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
          if (sortedBy === "price-high") return b.total - a.total;
          if (sortedBy === "price-low") return a.total - b.total;
          return 0;
        })
    : [];

  const getOrderCountByStatus = (status) => {
    if (!orders) return 0;
    return orders.filter(order => order.status.toLowerCase() === status.toLowerCase()).length;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between mb-4">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse mx-4"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-6 text-center"
      >
        <div className="bg-red-50 rounded-xl p-8">
          <FiXCircle className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Error loading orders
          </h3>
          <p className="mt-2 text-gray-500">
            We couldn't load your orders. Please try again later.
          </p>
          <button
            onClick={() => fetchOrders(user.email)}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto p-6 text-center"
      >
        <div className="bg-gray-50 rounded-xl p-8">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No orders yet
          </h3>
          <p className="mt-2 text-gray-500">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Shopping
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">View and manage your order history</p>
      </motion.div>

      {/* Order Summary Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{orders.length}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FiShoppingBag className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Processing</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{getOrderCountByStatus('processing')}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiPackage className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Shipped</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{getOrderCountByStatus('shipped')}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiTruck className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{getOrderCountByStatus('delivered')}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiCheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 bg-white rounded-lg shadow-sm p-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders, products, or recipient..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiClock className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="last30">Last 30 Days</option>
                <option value="last6">Last 6 Months</option>
                <option value="lastyear">Last Year</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={sortedBy}
                onChange={(e) => setSortedBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center"
          >
            <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTimeFilter("all");
              }}
              className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const items = order.items || [];
              const itemTotal = items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              const shipping = order.shipping || 0;
              const tax = order.tax || 0;
              const grandTotal = order.total || itemTotal + shipping + tax;
              const isExpanded = expandedOrder === order._id;
              const canReview = order.status === "delivered" && 
                !items.some(item => item.reviewed) &&
                new Date(order.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
              const canReturn = order.status === "delivered" && 
                new Date(order.createdAt) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-200 hover:shadow-md cursor-pointer"
                    onClick={() => handleOrderClick(order._id)}
                  >
                    <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between">
                      <div className="flex flex-col sm:flex-row sm:space-x-8">
                        <div>
                          <p className="text-sm text-gray-500">Order #</p>
                          <p className="font-medium text-gray-900">
                            {order._id.slice(0, 8).toUpperCase()}...
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0">
                          <p className="text-sm text-gray-500">Placed on</p>
                          <p className="font-medium text-gray-900">
                            {format(new Date(order.createdAt), "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-medium text-gray-900">
                            ₹{grandTotal.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-1">
                              Order:
                            </span>
                            <StatusBadge status={order.status || "Pending"} />
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-1">
                              Payment:
                            </span>
                            <PaymentStatusBadge
                              status={order.paymentStatus || "Pending"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 sm:p-6">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subtotal
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {items.slice(0, isExpanded ? items.length : 2).map((item, idx) => (
                              <motion.tr 
                                key={idx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                                      {item.image ? (
                                        <img
                                          className="h-full w-full object-cover"
                                          src={item.image}
                                          alt={item.name}
                                        />
                                      ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                                          <FiPackage className="h-6 w-6" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div 
                                        className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          navigate(`/products/${item.productId}`);
                                        }}
                                      >
                                        {item.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {item.variant || "Standard"}
                                      </div>
                                      {item.reviewed ? (
                                        <div className="mt-1 flex items-center">
                                          <span className="text-xs text-gray-500">Reviewed</span>
                                          <FiStar className="ml-1 h-3 w-3 text-yellow-400" />
                                        </div>
                                      ) : (
                                        canReview && (
                                          <div
                                            className="mt-1 inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              navigate(`/review/${order._id}/${item.productId}`);
                                            }}
                                          >
                                            Write a review
                                            <FiStar className="ml-1 h-3 w-3" />
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-right text-sm text-gray-500">
                                  ₹{item.price.toLocaleString('en-IN')}
                                </td>
                                <td className="px-4 py-4 text-right text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {items.length > 2 && (
                        <button
                          onClick={(e) => toggleOrderExpand(order._id, e)}
                          className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                          {isExpanded ? "Show less" : `Show all ${items.length} items`}
                          <FiChevronRight className={`ml-1 transform ${isExpanded ? "rotate-90" : ""}`} />
                        </button>
                      )}
                    </div>
                    
                    <div className="px-5 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center">
                      {canReturn && (
                        <button 
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle return logic here
                          }}
                        >
                          <FiRepeat className="mr-2 h-4 w-4" />
                          Return Items
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  let color = "";
  let icon = null;

  switch (status.toLowerCase()) {
    case "shipped":
      color = "bg-blue-100 text-blue-800";
      icon = <FiTruck className="mr-1" />;
      break;
    case "delivered":
      color = "bg-green-100 text-green-800";
      icon = <FiCheckCircle className="mr-1" />;
      break;
    case "returned":
      color = "bg-purple-100 text-purple-800";
      icon = <FiRepeat className="mr-1" />;
      break;
    case "cancelled":
      color = "bg-red-100 text-red-800";
      icon = <FiXCircle className="mr-1" />;
      break;
    case "processing":
      color = "bg-purple-100 text-purple-800";
      icon = <FiPackage className="mr-1" />;
      break;
    case "pending":
    default:
      color = "bg-yellow-100 text-yellow-800";
      icon = <FiClock className="mr-1" />;
      break;
  }

  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <motion.span 
      className={`${base} ${color}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      {formattedStatus}
    </motion.span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  let color = "";
  let icon = null;

  switch (status.toLowerCase()) {
    case "paid":
      color = "bg-green-100 text-green-800";
      icon = <FiCheckCircle className="mr-1" />;
      break;
    case "failed":
      color = "bg-red-100 text-red-800";
      icon = <FiXCircle className="mr-1" />;
      break;
    case "refunded":
      color = "bg-purple-100 text-purple-800";
      icon = <FiDollarSign className="mr-1" />;
      break;
    case "pending":
    default:
      color = "bg-yellow-100 text-yellow-800";
      icon = <FiClock className="mr-1" />;
      break;
  }

  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <motion.span 
      className={`${base} ${color}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      {formattedStatus}
    </motion.span>
  );
};

export default MyOrders;