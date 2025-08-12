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
} from "react-icons/fi";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const { orders, fetchOrders, loading } = useOrders();

  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    }
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-gray-50 rounded-xl p-8">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No orders yet
          </h3>
          <p className="mt-2 text-gray-500">
            You haven't placed any orders yet. Start shopping to see your orders
            here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">View your order history</p>
      </div>
      <div className="space-y-6">
        {[...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order) => {
            const items = order.items || [];
            const itemTotal = items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            const shipping = order.shipping || 0;
            const tax = order.tax || 0;
            const grandTotal = order.total || itemTotal + shipping + tax;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <Link to={`/myorders/${order._id}`}>
                  <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Order #</p>
                      <p className="font-medium text-gray-900">{order._id}</p>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <p className="text-sm text-gray-500">Placed on</p>
                      <p className="font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
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
                </Link>
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
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                                  {item.image ? (
                                    <img
                                      className="h-full w-full object-cover"
                                      src={item.image}
                                      alt={item.name}
                                    />
                                  ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                      <FiPackage />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.variant || "Standard"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right text-sm text-gray-500">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-4 text-right text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
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
      icon = <FiCheckCircle className="mr-1" />;
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

  const formattedStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`${base} ${color}`}>
      {icon}
      {formattedStatus}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
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

  const formattedStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`${base} ${color}`}>
      {icon}
      {formattedStatus}
    </span>
  );
};

export default MyOrders;