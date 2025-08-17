import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../api/productsApi";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaArrowRight } from "react-icons/fa";

const ProductsShowcase = () => {
  const [products, setProducts] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        const topSellingProducts = data.filter(product => product.topSelling);
        
        if (topSellingProducts.length > 0) {
          const randomFeaturedIndex = Math.floor(Math.random() * topSellingProducts.length);
          setFeaturedProduct(topSellingProducts[randomFeaturedIndex]);
          
          const productsForGrid = [...topSellingProducts];
          productsForGrid.splice(randomFeaturedIndex, 1);
          
          const shuffledProducts = productsForGrid.sort(() => 0.5 - Math.random());
          setProducts(shuffledProducts.slice(0, 12));
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading)
    return (
      <motion.div 
        className="min-h-[40vh] flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="h-10 w-10 rounded-full border-t-2 border-blue-500"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </motion.div>
    );

  if (error)
    return (
      <motion.div 
        className="text-red-500 text-center py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>Error loading products</p>
        <p className="text-sm">{error}</p>
      </motion.div>
    );

  if (!loading && products.length === 0 && !featuredProduct) {
    return (
      <motion.section 
        className="px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center py-10">
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            No top-selling products found
          </h2>
          <p className="text-gray-500 mb-4">
            Check back later for our featured products
          </p>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              to="/shop"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse All Products <FaArrowRight className="inline ml-1" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      className="px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Featured Block */}
      <motion.div
        className="mb-10 bg-blue-50 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background image pattern */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: 0.3 }}
        >
          {featuredProduct?.image?.[0] && (
            <img 
              src={featuredProduct.image[0]} 
              alt="" 
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
        
        <div className="flex-1 z-10">
          <motion.div 
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * i }}
              >
                <FaStar className="text-yellow-400 text-sm" />
              </motion.div>
            ))}
            <motion.span 
              className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              FEATURED TOP SELLER
            </motion.span>
          </motion.div>
          
          <motion.h2 
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {featuredProduct?.name || "Our Top-Selling Products"}
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 text-sm mb-4 line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {featuredProduct?.description || "Customer favorites that everyone's loving. High-quality, top-reviewed items you can trust."}
          </motion.p>
          
          {featuredProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ x: 5 }}
            >
              <Link
                to={`/products/${featuredProduct._id}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View this product <FaArrowRight className="ml-1" />
              </Link>
            </motion.div>
          )}
        </div>
        
        {featuredProduct?.image?.[0] && (
          <motion.div
            className="flex-shrink-0 w-full sm:w-48 h-48 overflow-hidden z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={featuredProduct.image[0]}
              alt={featuredProduct.name}
              className="w-full h-full object-contain p-2"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.4) }}
              whileHover={{ y: -5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
};

export default ProductsShowcase;