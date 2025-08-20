import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiDollarSign,
  FiPackage,
  FiUsers,
  FiAlertTriangle,
  FiTrendingUp,
  FiChevronRight,
  FiRefreshCw,
  FiPlus,
  FiShoppingCart,
  FiMail,
  FiBarChart2,
  FiSearch,
  FiFilter,
  FiX,
} from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Format currency in Indian Rupee
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format price with decimal places for individual items
const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Simple Bar Chart Component
const BarChart = ({ data, width = '100%', height = 250 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  const values = data.map(d => d.value);
  const maxValue = Math.max(...values);
  const chartHeight = 180;
  const barWidth = 30;
  const spacing = 10;
  
  return (
    <div style={{ width, height }} className="relative">
      <svg viewBox={`0 0 ${data.length * (barWidth + spacing) + 40} ${chartHeight + 40}`} className="w-full h-full">
        {/* Y-axis grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <g key={i}>
            <line 
              x1={20} 
              y1={20 + (ratio * chartHeight)} 
              x2={data.length * (barWidth + spacing) + 30} 
              y2={20 + (ratio * chartHeight)} 
              stroke="#F3F4F6" 
              strokeWidth="1" 
            />
            <text 
              x={15} 
              y={20 + (ratio * chartHeight)} 
              textAnchor="end" 
              dominantBaseline="middle" 
              className="text-xs fill-gray-500"
            >
              {Math.round(maxValue * (1 - ratio)).toLocaleString()}
            </text>
          </g>
        ))}
        
        {/* X-axis */}
        <line 
          x1={20} 
          y1={chartHeight + 20} 
          x2={data.length * (barWidth + spacing) + 30} 
          y2={chartHeight + 20} 
          stroke="#E5E7EB" 
          strokeWidth="2" 
        />
        
        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = 25 + i * (barWidth + spacing);
          const y = chartHeight + 20 - barHeight;
          
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3B82F6"
                rx="2"
              />
              <text 
                x={x + barWidth/2} 
                y={chartHeight + 35} 
                textAnchor="middle" 
                className="text-xs fill-gray-500"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// Simple Pie Chart Component
const PieChart = ({ data, width = '100%', height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  return (
    <div style={{ width, height }} className="relative flex flex-col items-center">
      <div className="flex flex-wrap justify-center mt-2 gap-x-4 gap-y-2 mb-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-sm mr-1" 
              style={{ backgroundColor: colors[i % colors.length] }}
            ></div>
            <span className="text-xs text-gray-600">
              {item.name} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Generate mock revenue data for the chart
const generateRevenueData = (timeRange) => {
  const data = [];
  const days = timeRange === "last7days" ? 7 : timeRange === "last30days" ? 30 : 12;
  const baseValue = timeRange === "last7days" ? 50000 : timeRange === "last30days" ? 20000 : 10000;
  
  for (let i = 0; i < days; i++) {
    const label = timeRange === "last90days" ? `M${i+1}` : `D${i+1}`;
    data.push({
      label,
      value: Math.floor(baseValue + Math.random() * baseValue * 0.5),
    });
  }
  
  return data;
};

// Generate category distribution data
const generateCategoryData = (products) => {
  const categoryMap = {};
  
  products.forEach(product => {
    if (product.category) {
      if (categoryMap[product.category]) {
        categoryMap[product.category] += 1;
      } else {
        categoryMap[product.category] = 1;
      }
    }
  });
  
  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockItems: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("last30days");
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel for better performance
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/order`),
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/users`),
      ]);

      const orders = ordersRes.data;
      const products = productsRes.data;
      const users = usersRes.data;

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const lowStockItems = products.filter(product => product.stock < 10).length;
      
      // Extract unique categories from products
      const uniqueCategories = [...new Set(products.map(product => product.category))].filter(Boolean);
      
      // Get recent orders (last 5)
      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      const recentOrdersData = sortedOrders.slice(0, 5);
      
      // Get top selling products (by stock movement or price)
      const sortedProducts = [...products].sort((a, b) => 
        (b.price * (b.sold || 0)) - (a.price * (a.sold || 0))
      );
      const topProductsData = sortedProducts.slice(0, 3);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: users.length,
        totalProducts: products.length,
        lowStockItems
      });
      
      setRecentOrders(recentOrdersData);
      setTopProducts(topProductsData);
      setCategories(uniqueCategories);
      
      // Generate chart data
      setRevenueData(generateRevenueData(timeRange));
      setCategoryData(generateCategoryData(products));
      
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  const filteredOrders = recentOrders.filter(order => {
    const matchesSearch = order.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["all", "Delivered", "Shipped", "Processing", "Cancelled", "Order Placed"];

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="animate-spin mx-auto h-10 w-10 text-blue-500" />
          <p className="mt-3 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <FiAlertTriangle className="mx-auto h-10 w-10 text-yellow-500" />
          <h2 className="mt-3 text-lg font-semibold text-gray-800">Something went wrong</h2>
          <p className="mt-1 text-gray-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center mx-auto text-sm"
          >
            <FiRefreshCw className="mr-2" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              Dashboard Overview
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Real-time insights into your store performance
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-3 md:mt-0">
            <button 
              onClick={refreshData}
              className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              title="Refresh data"
            >
              <FiRefreshCw className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} size={16} />
            </button>
            <select 
              className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
              <option value="last90days">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={<FiDollarSign className="text-blue-500" size={18} />}
            trend="up"
            change="12%"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon={<FiPackage className="text-purple-500" size={18} />}
            trend="up"
            change="8%"
          />
          <StatCard
            title="Customers"
            value={stats.totalCustomers.toLocaleString()}
            icon={<FiUsers className="text-green-500" size={18} />}
            trend="up"
            change="5%"
          />
          <StatCard
            title="Products"
            value={stats.totalProducts.toLocaleString()}
            icon={<FiPackage className="text-indigo-500" size={18} />}
            trend="neutral"
            change="All"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStockItems}
            icon={<FiAlertTriangle className="text-yellow-500" size={18} />}
            trend={stats.lowStockItems > 0 ? "alert" : "neutral"}
            change={stats.lowStockItems > 0 ? "Attention" : "Good"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Orders */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
                  <h2 className="text-md font-semibold text-gray-800">
                    Recent Orders
                  </h2>
                  
                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <div className="relative">
                      <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center text-sm"
                      >
                        <FiFilter className="mr-1 text-xs" /> Filters
                      </button>
                    </div>
                  </div>
                </div>
                
                {showFilters && (
                  <div className="flex flex-wrap gap-1.5 mb-3 p-2 bg-gray-50 rounded-md">
                    {statusOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => setStatusFilter(option)}
                        className={`px-2 py-1 rounded-full text-xs capitalize ${statusFilter === option ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
                      >
                        {option === "all" ? "All" : option}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowFilters(false)}
                      className="ml-auto p-0.5 text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                          <div className="max-w-[10rem] truncate" title={order.email || 'N/A'}>
                            {order.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-gray-900">
                          {formatPrice(order.total || 0)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr className="col-span-full">
                        <td colSpan="5" className="text-center py-6 text-gray-500 text-sm">
                          {searchTerm || statusFilter !== "all" ? "No orders match your filters" : "No orders found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-1">
                <h2 className="text-md font-semibold text-gray-800">
                  Revenue Overview
                </h2>
                <div className="flex space-x-1">
                  <button 
                    className={`px-2 py-1 text-xs rounded ${timeRange === "last7days" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
                    onClick={() => setTimeRange("last7days")}
                  >
                    7D
                  </button>
                  <button 
                    className={`px-2 py-1 text-xs rounded ${timeRange === "last30days" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
                    onClick={() => setTimeRange("last30days")}
                  >
                    30D
                  </button>
                  <button 
                    className={`px-2 py-1 text-xs rounded ${timeRange === "last90days" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}
                    onClick={() => setTimeRange("last90days")}
                  >
                    90D
                  </button>
                </div>
              </div>
              <div className="h-52">
                <BarChart data={revenueData} />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Inventory Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-md font-semibold text-gray-800 mb-3">
                Inventory Summary
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Total Products
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    {stats.totalProducts}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">
                    Categories
                  </p>
                  <div className="h-32">
                    <PieChart data={categoryData} />
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">
                    Low Stock Items
                  </p>
                  <p
                    className={`text-md font-semibold ${
                      stats.lowStockItems > 0 ? "text-yellow-600" : "text-gray-800"
                    }`}
                  >
                    {stats.lowStockItems}{" "}
                    {stats.lowStockItems > 0 ? "⚠️ Needs attention" : "✅ All good"}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-md font-semibold text-gray-800 mb-3">
                Top Products
              </h2>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center p-1.5 hover:bg-gray-50 rounded-md transition-colors">
                    <span className="text-gray-500 font-medium text-xs mr-2">
                      {index + 1}
                    </span>
                    <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FiPackage className="text-gray-400 text-xs" />
                      )}
                    </div>
                    <div className="ml-2 flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.stock} in stock • {product.sold || 0} sold
                      </p>
                    </div>
                    <div className="ml-2 flex items-center text-green-600 text-xs font-semibold">
                      <FiTrendingUp className="mr-0.5" /> {formatPrice(product.price)}
                    </div>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <p className="text-gray-500 text-xs">No products found</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-md font-semibold text-gray-800 mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-blue-50 hover:bg-blue-100 text-blue-800 p-2 rounded-md text-xs font-medium transition-colors flex flex-col items-center justify-center h-16">
                  <FiPlus className="mb-0.5 text-sm" />
                  Add Product
                </button>
                <button className="bg-purple-50 hover:bg-purple-100 text-purple-800 p-2 rounded-md text-xs font-medium transition-colors flex flex-col items-center justify-center h-16">
                  <FiShoppingCart className="mb-0.5 text-sm" />
                  Create Order
                </button>
                <button className="bg-green-50 hover:bg-green-100 text-green-800 p-2 rounded-md text-xs font-medium transition-colors flex flex-col items-center justify-center h-16">
                  <FiMail className="mb-0.5 text-sm" />
                  Send Promotion
                </button>
                <button className="bg-orange-50 hover:bg-orange-100 text-orange-800 p-2 rounded-md text-xs font-medium transition-colors flex flex-col items-center justify-center h-16">
                  <FiBarChart2 className="mb-0.5 text-sm" />
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simplified Stat Card Component
function StatCard({ title, value, icon, trend, change }) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    alert: "text-yellow-600",
    neutral: "text-gray-600",
  };

  const trendIcons = {
    up: <FiTrendingUp className="inline ml-0.5" size={12} />,
    down: <FiTrendingUp className="inline ml-0.5 transform rotate-180" size={12} />,
    alert: "⚠️",
    neutral: "",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-lg font-semibold text-gray-800 mt-0.5">
            {value}
          </p>
        </div>
        <div className="p-1.5 bg-gray-100 rounded-md text-gray-600">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <span
          className={`inline-flex items-center text-xs ${trendColors[trend]}`}
        >
          {change} {trendIcons[trend]}
        </span>
      </div>
    </div>
  );
}

// Simplified Status Badge Component
function StatusBadge({ status }) {
  const statusColors = {
    Delivered: "bg-green-100 text-green-800",
    Shipped: "bg-blue-100 text-blue-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
    "Order Placed": "bg-purple-100 text-purple-800",
  };

  const displayStatus = status || "Processing";
  
  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${statusColors[displayStatus]}`}
    >
      {displayStatus}
    </span>
  );
}