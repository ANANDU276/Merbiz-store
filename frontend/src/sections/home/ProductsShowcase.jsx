import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../api/productsApi";
import ProductCard from "../../components/ProductCard";
import { FaStar, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const ProductsShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.slice(0, 12)); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500">
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-lg">Error loading products</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <main className=" mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {/* Featured Card - spans 2 columns on sm and lg screens */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="col-span-1 sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[420px]"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                FEATURED ITEMS
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
              Top 12 Bestsellers <span className="text-blue-600">This Week</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Discover our handpicked selection of the most popular electronics this week. These trending items are loved by customers for their quality and performance.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-fit"
          >
            Explore All Products
            <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>

        {/* Product Cards */}
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
};

export default ProductsShowcase;