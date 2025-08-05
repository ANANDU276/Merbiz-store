import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { FaHeart, FaShoppingCart, FaTrash, FaRegHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, fetchWishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleMoveToCart = async (product) => {
    setProcessing(product._id);
    try {
      await addToCart(product);
      await removeFromWishlist(product._id);
    } catch (error) {
      console.error("Error moving to cart:", error);
    } finally {
      setProcessing(null);
    }
  };

  const handleRemove = async (productId) => {
    setProcessing(productId);
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <FaRegHeart className="text-5xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Wishlist is Empty</h2>
        <p className="text-gray-500 mb-6">Save your favorite items here for later</p>
        <Link 
          to="/products"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          <FaHeart className="inline text-red-500 mr-2" />
          My Wishlist
        </h1>
        <span className="text-gray-600">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {wishlist.map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Fixed image container with white background */}
              <div className="mb-3 bg-gray-50 rounded-lg overflow-hidden">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image || '/placeholder-product.jpg'}
                    alt={product.title}
                    className="w-full h-48 object-contain mx-auto p-4"
                    style={{ backgroundColor: 'white' }} // Ensures white background
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                      e.target.style.backgroundColor = 'white'; // Fallback also has white bg
                    }}
                  />
                </Link>
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">
                    {product.category}
                  </p>
                </div>
                <button 
                  onClick={() => handleRemove(product._id)}
                  disabled={processing === product._id}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Remove from wishlist"
                >
                  {processing === product._id ? (
                    <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>

              <div className="mt-3">
                <span className="font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => handleMoveToCart(product)}
                disabled={processing === product._id}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
              >
                {processing === product._id ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaShoppingCart />
                    Add to Cart
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {wishlist.length > 0 && (
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              wishlist.forEach(product => {
                handleMoveToCart(product);
              });
            }}
            disabled={processing}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {processing ? 'Adding All...' : 'Add All to Cart'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;