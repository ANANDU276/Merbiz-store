import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  X, 
  ShoppingBag, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Heart, 
  Share2, 
  Trash2,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useWishlist } from "../context/WishlistContext";

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity, 
    clearCart,
    moveToWishlist 
  } = useCart();
  
  const { addToWishlist } = useWishlist();
  const [expandedItems, setExpandedItems] = useState({});

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99; // Fixed shipping cost
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Clear Your Cart?",
      text: "This will remove all items from your shopping cart",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Keep items",
      customClass: {
        popup: 'rounded-lg shadow-xl',
        confirmButton: 'px-4 py-2 rounded-md',
        cancelButton: 'px-4 py-2 rounded-md'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          title: "Cart Cleared!",
          text: "Your shopping cart is now empty",
          icon: "success",
          confirmButtonColor: "#3085d6",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        });
      }
    });
  };

  const handleMoveToWishlist = (item) => {
    removeFromCart(item._id);
    addToWishlist(item);
    Swal.fire({
      icon: "success",
      title: "Moved to Wishlist!",
      text: `${item.name} has been moved to your wishlist`,
      confirmButtonColor: "#3085d6",
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleShareItem = (item) => {
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: `Check out this ${item.name} on our store!`,
        url: `${window.location.origin}/products/${item.slug || item._id}`,
      }).catch(() => {
        Swal.fire({
          icon: "info",
          title: "Copied to Clipboard",
          text: "Product link has been copied to your clipboard",
          confirmButtonColor: "#3085d6"
        });
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${item.slug || item._id}`);
      Swal.fire({
        icon: "info",
        title: "Copied to Clipboard",
        text: "Product link has been copied to your clipboard",
        confirmButtonColor: "#3085d6"
      });
    }
  };

  // Animation variants
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
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  const summaryVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { delay: 0.3 } },
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-4 py-6 sm:py-10 mx-auto max-w-7xl"
    >
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <motion.ol 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center space-x-2 text-sm text-gray-500"
        >
          <li>
            <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
              <ArrowLeft size={16} className="mr-1" /> Home
            </Link>
          </li>
          <li>
            <span aria-hidden="true">/</span>
          </li>
          <li aria-current="page" className="text-gray-400">
            Shopping Cart
          </li>
        </motion.ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-4 border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h2 className="font-semibold text-lg sm:text-xl flex items-center gap-2">
                <ShoppingBag size={20} className="text-blue-600" />
                Your Shopping Cart
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
                {cart.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClearCart}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors px-3 py-1 border border-red-200 rounded-md flex items-center gap-1"
                    aria-label="Clear cart"
                  >
                    <Trash2 size={14} /> Clear Cart
                  </motion.button>
                )}
              </div>
            </div>

            {cart.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.article
                      key={`${item._id}-${item.color}-${item.storage}`}
                      variants={itemVariants}
                      exit="exit"
                      layout
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:shadow transition group"
                    >
                      {/* Product Image */}
                      <Link
                        to={`/product/${item.slug || item._id}`}
                        className="w-full sm:w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 relative"
                      >
                        <motion.img
                          src={item.image[0] || "/default-product.png"}
                          alt={item.name || "Product"}
                          className="object-contain w-full h-full"
                          loading="lazy"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        />
                        {item.discount && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            -{item.discount}%
                          </span>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <Link
                              to={`/product/${item.slug || item._id}`}
                              className="font-medium hover:text-blue-600 transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                            <p className="text-gray-600 text-sm mt-1">
                              ₹{item.price.toLocaleString()}
                              {item.originalPrice && (
                                <span className="ml-2 text-gray-400 line-through">
                                  ₹{item.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </p>
                            
                            {/* Collapsible details */}
                            <button 
                              onClick={() => toggleItemExpansion(item._id)}
                              className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center"
                            >
                              {expandedItems[item._id] ? (
                                <>
                                  Hide details <ChevronUp size={14} className="ml-1" />
                                </>
                              ) : (
                                <>
                                  Show details <ChevronDown size={14} className="ml-1" />
                                </>
                              )}
                            </button>
                            
                            <AnimatePresence>
                              {expandedItems[item._id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                                    {item.storage && (
                                      <p>Storage: {item.storage}</p>
                                    )}
                                    {item.color && (
                                      <p>Color: {item.color}</p>
                                    )}
                                    {item.size && (
                                      <p>Size: {item.size}</p>
                                    )}
                                    {item.description && (
                                      <p className="line-clamp-2">{item.description}</p>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <X size={18} />
                          </motion.button>
                        </div>

                        {/* Quantity Controls and Actions */}
                        <div className="flex items-center justify-between mt-3 gap-4">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => decreaseQuantity(item._id)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </motion.button>
                            <span className="mx-3 w-6 text-center">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => increaseQuantity(item._id)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </motion.button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                            
                            <div className="flex gap-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleMoveToWishlist(item)}
                                className="p-1 text-gray-400 hover:text-pink-500 transition-colors"
                                title="Move to wishlist"
                              >
                                <Heart size={16} />
                              </motion.button>
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleShareItem(item)}
                                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                title="Share product"
                              >
                                <Share2 size={16} />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              // Empty Cart View
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-6 sm:p-12 text-center"
              >
                <div className="max-w-md mx-auto">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
                  >
                    <ShoppingBag size={32} className="text-gray-400" />
                  </motion.div>
                  <h2 className="text-lg sm:text-xl font-medium mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-600 mb-4 sm:mb-6">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                  >
                    <Link
                      to="/"
                      className="inline-block bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      to="/wishlist"
                      className="inline-block border border-gray-300 text-gray-700 px-5 sm:px-6 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors"
                    >
                      View Wishlist
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <motion.div
            variants={summaryVariants}
            initial="hidden"
            animate="show"
            className="lg:w-1/3"
          >
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm sticky top-4 border border-gray-100">
              <h2 className="font-semibold text-lg sm:text-xl mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between font-medium text-base sm:text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.01 }} 
                whileTap={{ scale: 0.99 }}
                className="mt-6"
              >
                <Link to="/checkout">
                  <button
                    className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    aria-label="Proceed to checkout"
                  >
                    <ShoppingBag size={18} />
                    Proceed to Checkout
                  </button>
                </Link>
              </motion.div>

              <div className="mt-4 text-xs text-gray-500">
                <p>✔ 30-day easy returns</p>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3 text-sm">
                <Link
                  to="/"
                  className="text-center text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  );
};

export default Cart;