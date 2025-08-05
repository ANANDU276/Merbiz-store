import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../api/productsApi";
import { ArrowLeft } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const getProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        setSelectedColor(data?.colors?.[0] || "");
        setSelectedImage(data?.images?.[0] || data.image);
      } catch (err) {
        setError(err.message);
      }
    };
    getProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(1, prev - 1)
    );
  };

  if (error)
    return (
      <div className="px-4 py-10 mx-auto text-center text-red-500">
        Error: {error}
      </div>
    );
  if (!product)
    return <div className="px-4 py-10 mx-auto text-center">Loading...</div>;

  return (
    <main className="px-4 py-10 mx-auto ">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Images Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible">
                {[product.image, ...(product.images || [])].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden ${
                      selectedImage === img
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-gray-50 rounded-lg flex items-center justify-center p-4">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-80 object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-bold text-blue-600">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 text-sm ml-1">
                  ({product.ratingCount || 0} reviews)
                </span>
              </div>
            )}

            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Color: <span className="font-normal">{selectedColor}</span>
                </h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Quantity
              </h3>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  onClick={() => handleQuantityChange("decrement")}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 text-center border-x border-gray-300 py-2">
                  {quantity}
                </span>
                <button
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  onClick={() => handleQuantityChange("increment")}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
                Buy Now
              </button>
              <button className="flex-1 bg-white border border-blue-600 text-blue-600 py-3 rounded-md font-medium hover:bg-blue-50 transition-colors">
                Add to Cart
              </button>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-3">Product Details</h3>
              <ul className="text-sm space-y-2 text-gray-600">
                {product.details?.map((detail, i) => (
                  <li key={i} className="flex">
                    <span className="text-gray-400 mr-2">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-3">Shipping & Returns</h3>
              <div className="text-sm space-y-2 text-gray-600">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong>Free shipping</strong> on orders over ₹1000
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong>Delivery:</strong> 2-4 business days
                  </span>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>
                    <strong>Returns:</strong> 30-day return policy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;