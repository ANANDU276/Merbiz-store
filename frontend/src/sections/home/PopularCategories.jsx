import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PopularCategories = () => {
  const categories = [
    "Headphones",
    "Phones",
    "Speakers",
    "Smart Watches",
    "Gaming",
    "Laptops",
  ];

  const brands = [
    { name: "Samsung" },
    { name: "Apple" },
    { name: "Sony" },
    { name: "Bose" },
    { name: "LG" },
    { name: "Boat" },
    { name: "JBL" },
    { name: "OnePlus" },
    { name: "Xiaomi" },
    { name: "HP" },
    { name: "Dell" },
    { name: "Asus" },
  ];

  // Animation variants for categories
  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Categories Section */}
        <motion.h2 
          className="text-3xl font-bold text-center text-gray-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Popular Categories
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={categoryVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/products?category=${category.toLowerCase()}`}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-center block"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {category}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Brands Section */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Featured Brands
        </h2>

        <div className="flex flex-wrap justify-center gap-4 py-2">
          {brands.map((brand, index) => (
            <div key={index} className="text-lg font-medium text-gray-700">
              {brand.name}
              {index < brands.length - 1 && <span className="text-gray-400 ml-4">|</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;