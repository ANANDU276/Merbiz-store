import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import {
  Heart,
  ShoppingCart,
  X,
  Loader2,
  CheckSquare,
  Square,
} from "lucide-react";

const Wishlist = () => {
  const { wishlist, fetchWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [processing, setProcessing] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

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
    <main className="px-4 py-10 mx-auto max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Wishlist</span>
      </div>

      <div className="flex flex-col">
        <div className="bg-white p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Your Wishlist
              </h2>
              <p className="text-sm text-gray-500">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
              </p>
            </div>
            {wishlist.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedItems.length > 0 && (
                  <button
                    onClick={moveSelectedToCart}
                    disabled={processing === "bulk"}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 transition disabled:opacity-50"
                  >
                    {processing === "bulk" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-4 h-4" />
                    )}
                    Move {selectedItems.length} to Cart
                  </button>
                )}
                <button
                  onClick={selectAllItems}
                  className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2"
                >
                  {selectedItems.length === wishlist.length ? (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4" />
                      Select All
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {wishlist.length > 0 ? (
            <div className="space-y-4">
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:shadow transition"
                >
                  {/* Checkbox */}
                  <div className="flex items-start pt-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => toggleSelectItem(item._id)}
                      className="accent-blue-600 w-4 h-4 mt-1"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={item.image?.[0] || "/placeholder-product.jpg"}
                      alt={item.title}
                      className="object-contain w-full h-full"
                      onError={(e) =>
                        (e.target.src = "/placeholder-product.jpg")
                      }
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium line-clamp-1 text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          ₹{item.price.toLocaleString()}
                        </p>
                        {item.category && (
                          <p className="text-xs text-gray-500 mt-1 capitalize">
                            Category: {item.category}
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                        aria-label="Remove item"
                        disabled={processing === item._id}
                      >
                        {processing === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X size={18} />
                        )}
                      </button>
                    </div>

                    {/* Move to Cart Button */}
                    <div className="flex items-center mt-3">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={processing === item._id}
                        className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
                      >
                        {processing === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart size={16} />
                            Move to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty Wishlist View
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-medium mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-gray-600 mb-6">
                  Save your favorite items and shop them anytime later.
                </p>
                <Link
                  to="/"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Wishlist;
