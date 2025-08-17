import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiDownload,
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEdit,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/order`);
        setOrders(res.data);
      } catch (err) {
        setError("Failed to fetch orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Order Placed"
  ).length;
  const returnRequests = orders.reduce(
    (count, order) =>
      count + order.items.filter((i) => i.returnRequest?.requested).length,
    0
  );

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/order/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update delivery status", err);
      alert("Status update failed.");
    }
  };

  const handleReturnStatusChange = async (orderId, itemId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/order/${orderId}/items/${itemId}/return/status`,
        { status: newStatus }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
                ...order,
                items: order.items.map((item) =>
                  item._id === itemId
                    ? {
                        ...item,
                        returnRequest: {
                          ...item.returnRequest,
                          status: newStatus,
                        },
                      }
                    : item
                ),
              }
            : order
        )
      );
    } catch (err) {
      console.error("Failed to update return status", err);
      alert("Return status update failed.");
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading orders...</div>
    );
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-3 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-800">
              Order Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all customer orders
            </p>
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center text-sm">
              <FiDownload className="mr-2" size={16} /> Export
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 flex items-center text-sm">
              <FiPlus className="mr-2" size={16} /> Create Order
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon="📦"
            trend="neutral"
            change="All time"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(totalRevenue / 1000).toFixed(1)}K`}
            icon="💰"
            trend="up"
            change="This month"
          />
          <StatCard
            title="Delivered"
            value={deliveredOrders}
            icon="✅"
            trend="neutral"
            change={`${Math.round((deliveredOrders / orders.length) * 100)}%`}
          />
          <StatCard
            title="Pending"
            value={pendingOrders}
            icon="⏳"
            trend={pendingOrders > 5 ? "alert" : "neutral"}
            change={`${Math.round((pendingOrders / orders.length) * 100)}%`}
          />
          <StatCard
            title="Return Requests"
            value={returnRequests}
            icon="🔄"
            trend={returnRequests > 0 ? "alert" : "neutral"}
            change={`${returnRequests} pending`}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h2>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* ORDERS WITH ITEMS */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Delivery Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Return Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.length > 0 ? (
                  currentOrders.flatMap((order, orderIndex) =>
                    order.items.map((item, itemIndex) => {
                      const isFirstItem = itemIndex === 0;
                      const rowClasses = [
                        "hover:bg-gray-50",
                        isFirstItem ? "border-t-2 border-gray-200" : "",
                        isFirstItem ? "bg-blue-50" : "",
                      ].join(" ");

                      return (
                        <tr
                          key={`${order._id}-${item._id}`}
                          className={rowClasses}
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {isFirstItem && `#${order._id.slice(-6)}`}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {isFirstItem && order.email}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {isFirstItem && formatDate(order.createdAt)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {item.name}
                            {item.quantity > 1 && ` (x${item.quantity})`}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {isFirstItem ? (
                              <StatusSelector
                                currentStatus={order.status}
                                orderId={order._id}
                                onStatusChange={handleStatusChange}
                              />
                            ) : (
                              <span className="text-gray-400">
                                Same as above
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {item.returnRequest?.requested ? (
                              <ReturnStatusSelector
                                currentStatus={
                                  item.returnRequest.status || "Pending"
                                }
                                orderId={order._id}
                                itemId={item._id}
                                onStatusChange={handleReturnStatusChange}
                              />
                            ) : (
                              <span className="text-gray-400 italic">
                                No Request
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-right text-sm">
                            {isFirstItem && (
                              <button
                                className="text-blue-600 hover:text-blue-900 p-1"
                                onClick={() => openOrderDetails(order)}
                              >
                                <FiEye size={16} />
                              </button>
                            )}
                            <button className="text-gray-600 hover:text-gray-900 p-1">
                              <FiEdit size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No orders found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filteredOrders.length > 0 && (
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstOrder + 1} to{" "}
                {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </p>
              <div className="space-x-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border text-sm rounded disabled:opacity-50"
                >
                  <FiChevronLeft />
                </button>
                <span className="px-2">{currentPage}</span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border text-sm rounded disabled:opacity-50"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ORDER DETAILS MODAL - Improved Version */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 animate-fade-in">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details
                </h2>
                <p className="text-sm text-gray-500">
                  #{selectedOrder._id.slice(-6)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Information */}
                <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.customerName || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span>{" "}
                      {selectedOrder.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedOrder.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-3 pb-2 border-b border-gray-200">
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {formatDateTime(selectedOrder.createdAt)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          selectedOrder.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.status === "Order Placed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedOrder.status}
                      </span>
                    </p>
                    <p className="text-sm font-medium">
                      <span className="font-medium">Total:</span> $
                      {selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Ordered */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  Items Ordered
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Subtotal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Return Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item._id}>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {item.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {item.returnRequest?.requested ? (
                              <div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    item.returnRequest.status === "Approved"
                                      ? "bg-green-100 text-green-800"
                                      : item.returnRequest.status === "Rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {item.returnRequest.status || "Pending"}
                                </span>
                                {item.returnRequest.reason && (
                                  <div className="mt-1 text-xs text-gray-600">
                                    <span className="font-medium">Reason:</span>{" "}
                                    {item.returnRequest.reason}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                No Request
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* DELIVERY STATUS SELECTOR */
function StatusSelector({ currentStatus, orderId, onStatusChange }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {
      await onStatusChange(orderId, newStatus);
    } catch (err) {
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      className={`border rounded px-2 py-1 text-sm ${
        loading ? "opacity-50" : ""
      }`}
      value={status}
      onChange={handleChange}
      disabled={loading}
    >
      <option value="Order Placed">Order Placed</option>
      <option value="Shipped">Shipped</option>
      <option value="Reached Nearby">Reached Nearby</option>
      <option value="Delivered">Delivered</option>
    </select>
  );
}

/* RETURN STATUS SELECTOR */
function ReturnStatusSelector({
  currentStatus,
  orderId,
  itemId,
  onStatusChange,
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {
      await onStatusChange(orderId, itemId, newStatus);
    } catch (err) {
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        className={`border rounded px-2 py-1 text-sm ${
          loading ? "opacity-50" : ""
        }`}
        value={status}
        onChange={handleChange}
        disabled={loading}
      >
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
      {loading && <FiRefreshCw className="animate-spin h-4 w-4" />}
    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value, icon, trend, change }) {
  const trendColors = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    alert: "text-yellow-600 bg-yellow-100",
    neutral: "text-gray-600 bg-gray-100",
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase">{title}</p>
          <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <span className="text-xl">{icon}</span>
      </div>
      <div
        className={`mt-2 text-xs px-2 py-0.5 inline-block rounded-full ${trendColors[trend]}`}
      >
        {change}
      </div>
    </div>
  );
}

export default Orders;
