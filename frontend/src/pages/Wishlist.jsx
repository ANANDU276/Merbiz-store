import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Heart, ShoppingCart, X, Loader2, CheckSquare, Square } from "lucide-react";
import { motion } from "framer-motion";

const Wishlist = () => {
  const { wishlist, fetchWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [processing, setProcessing] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  useEffect(() => {
    fetchWishlist();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const toggleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === wishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map((item) => item._id));
    }
  };

  const moveSelectedToCart = async () => {
    setProcessing("bulk");
    try {
      for (const productId of selectedItems) {
        const product = wishlist.find((p) => p._id === productId);
        if (product) {
          await addToCart(product);
          await removeFromWishlist(productId);
        }
      }
      setSelectedItems([]);
    } catch (error) {
      console.error("Error moving items to cart:", error);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 sm:px-6 py-8 sm:py-12 mx-auto max-w-7xl"
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6 sm:mb-8">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Wishlist</span>
      </div>

      <div className="flex flex-col">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Your Wishlist
              </h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
              </p>
            </div>
            {wishlist.length > 0 && (
              <div className="flex gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
                {selectedItems.length > 0 && (
                  <motion.button
                    onClick={moveSelectedToCart}
                    disabled={processing === "bulk"}
                    className="bg-blue-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 flex items-center gap-1 sm:gap-2 transition disabled:opacity-50 flex-1 sm:flex-none"
                    whileHover={{ y: isMobile ? 0 : -2 }}
                    whileTap={{ scale: isMobile ? 0.98 : 1 }}
                  >
                    {processing === "bulk" ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    <span className="truncate">
                      Move {selectedItems.length} to Cart
                    </span>
                  </motion.button>
                )}
                <motion.button
                  onClick={selectAllItems}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none"
                  whileHover={{ y: isMobile ? 0 : -2 }}
                  whileTap={{ scale: isMobile ? 0.98 : 1 }}
                >
                  {selectedItems.length === wishlist.length ? (
                    <>
                      <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Select All</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </div>

          {wishlist.length > 0 ? (
            <motion.div 
              className="space-y-3 sm:space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {wishlist.map((item) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-100 rounded-lg sm:rounded-xl hover:shadow-md transition-all"
                  whileHover={{ y: isMobile ? 0 : -3 }}
                  whileTap={{ scale: isMobile ? 0.98 : 1 }}
                >
                  {/* Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => toggleSelectItem(item._id)}
                      className="accent-blue-600 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-1 cursor-pointer"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.image?.[0] || "/placeholder-product.jpg"}
                      alt={item.title}
                      className="object-contain w-full h-full"
                      onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="pr-2">
                        <Link to={`/product/${item._id}`} className="block">
                          <h3 className="font-medium sm:font-semibold text-gray-900 hover:text-blue-600 transition-colors text-sm sm:text-base line-clamp-2">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-gray-800 font-medium mt-1 text-sm sm:text-base">
                          ₹{item.price.toLocaleString()}
                        </p>
                        {item.category && (
                          <p className="text-xs text-gray-500 mt-1 capitalize line-clamp-1">
                            Category: {item.category}
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        onClick={() => handleRemove(item._id)}
                        className="text-gray-400 hover:text-red-500 ml-1 sm:ml-2 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                        disabled={processing === item._id}
                        whileHover={{ scale: isMobile ? 1 : 1.1 }}
                      >
                        {processing === item._id ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <X size={16} className="sm:w-5 sm:h-5" />
                        )}
                      </motion.button>
                    </div>

                    {/* Move to Cart Button */}
                    <div className="flex items-center mt-2 sm:mt-3">
                      <motion.button
                        onClick={() => handleMoveToCart(item)}
                        disabled={processing === item._id}
                        className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg transition disabled:opacity-50"
                        whileHover={{ y: isMobile ? 0 : -2 }}
                        whileTap={{ scale: isMobile ? 0.98 : 1 }}
                      >
                        {processing === item._id ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                            <span>Move to Cart</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Empty Wishlist View
            <motion.div 
              className="bg-white rounded-xl shadow-sm p-6 sm:p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-50 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <Heart className="h-6 w-6 sm:h-10 sm:w-10 text-blue-400" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Save your favorite items and shop them anytime later.
                </p>
                <Link
                  to="/"
                  className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Start Shopping
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.main>
  );
};

export default Wishlist;