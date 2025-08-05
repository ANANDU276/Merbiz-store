import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

const Checkout = () => {
  // Mock data for UI purposes
  const mockItems = [
    {
      id: 1,
      name: "Macbook Air 13-inch M1 Chip",
      price: 999,
      image: "https://example.com/macbook.jpg",
      quantity: 1
    },
    {
      id: 2,
      name: "JBL GO 3 Bluetooth Speaker",
      price: 49,
      image: "https://example.com/jbl.jpg",
      quantity: 2
    }
  ];

  const subtotal = mockItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 9.99;
  const tax = (subtotal * 0.08).toFixed(2);
  const total = (subtotal + shipping + parseFloat(tax)).toFixed(2);

  return (
    <main className="px-4 py-10 mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-blue-600">
          Cart
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Checkout</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Checkout Form - Main Content */}
        <div className="lg:w-2/3">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="emailUpdates"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailUpdates" className="ml-2 text-sm text-gray-700">
                  Email me with news and offers
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main St"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option>Select state</option>
                    <option>California</option>
                    <option>New York</option>
                    <option>Texas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="tel" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(123) 456-7890"
                />
              </div>
            </form>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="credit-card" 
                    name="payment" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="credit-card" className="ml-3 block text-sm font-medium">
                    Credit Card
                  </label>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Security Code</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="CVC"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="paypal" 
                    name="payment" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="paypal" className="ml-3 block text-sm font-medium">
                    PayPal
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary - Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {mockItems.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <p className="text-gray-600 text-sm">₹{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>₹{shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-gray-200 pt-3 mt-2">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium mt-6 hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Check size={18} className="mr-2" />
              Complete Order
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              By completing your purchase you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;