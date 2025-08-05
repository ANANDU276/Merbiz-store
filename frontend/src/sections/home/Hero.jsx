import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import iphone16 from "../../assets/iphone16.png";
import controller from "../../assets/controller.png";
import headphones from "../../assets/headphones.png";
import watch from "../../assets/watch.png";
import { CategoryContext } from "../../context/CategoryContext";

function Hero() {
  const { setSelectedCategory } = useContext(CategoryContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <main className="mx-auto px-4 py-12">
      <motion.div 
        className="w-full flex flex-col lg:flex-row gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Featured Product - Left Column */}
        <motion.div 
          className="w-full lg:w-1/2"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 flex flex-col lg:flex-row items-center gap-8 h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-3">
                IN STOCK NOW
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                Upgrade Your <span className="text-blue-600">Tech Game</span>
              </h1>
              <p className="text-gray-600 mb-6 text-lg">
                Discover the latest smartphones with cutting-edge technology and premium designs.
              </p>
              <Link
                to="/phones"
                onClick={() => setSelectedCategory("Phones")}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Shop Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-2 bg-blue-200 rounded-full blur opacity-20"></div>
              <img
                src={iphone16}
                alt="Premium Smartphone"
                className="relative w-full object-contain transform hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </motion.div>

        {/* Secondary Products - Right Column */}
        <motion.div 
          className="w-full lg:w-1/2 flex flex-col gap-6"
          variants={itemVariants}
        >
          {/* Gaming Card */}
          <Link
            onClick={() => setSelectedCategory("electronics")}
            to="/productpage"
            className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all h-full overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full filter blur-3xl opacity-20"></div>
            <span className="inline-block px-3 py-1 bg-white text-gray-900 text-xs font-semibold rounded-full mb-4 z-10">
              GAMING
            </span>
            <div className="flex justify-center z-10">
              <motion.img
                src={controller}
                alt="Gaming Controller"
                className="w-full max-w-[250px] object-contain transform group-hover:scale-110 transition-transform"
                whileHover={{ scale: 1.05 }}
              />
            </div>
            <div className="z-10">
              <h3 className="text-xl font-semibold text-gray-900 mt-4">
                Ultimate Gaming Experience
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                High-performance gear for serious gamers
              </p>
            </div>
          </Link>

          {/* Headphones + Smartwatches Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Headphones Card */}
            <Link
              onClick={() => setSelectedCategory("Headphones")}
              to="/productpage"
              className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all h-full overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 rounded-full filter blur-3xl opacity-20"></div>
              <span className="inline-block px-3 py-1 bg-white text-gray-900 text-xs font-semibold rounded-full mb-4 z-10">
                HEADPHONES
              </span>
              <div className="flex justify-center z-10">
                <motion.img
                  src={headphones}
                  alt="Premium Headphones"
                  className="w-full max-w-[120px] object-contain transform group-hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.05 }}
                />
              </div>
              <div className="z-10">
                <h3 className="text-lg font-semibold text-gray-900 mt-4">
                  Crystal Clear Sound
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Immerse yourself in music
                </p>
              </div>
            </Link>

            {/* Smartwatch Card */}
            <Link
              onClick={() => setSelectedCategory("Headphones")}
              to="/productpage"
              className="relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all h-full overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 rounded-full filter blur-3xl opacity-20"></div>
              <span className="inline-block px-3 py-1 bg-white text-gray-900 text-xs font-semibold rounded-full mb-4 z-10">
                SMART WATCHES
              </span>
              <div className="flex justify-center z-10">
                <motion.img
                  src={watch}
                  alt="Smart Watch"
                  className="w-full max-w-[120px] object-contain transform group-hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.05 }}
                />
              </div>
              <div className="z-10">
                <h3 className="text-lg font-semibold text-gray-900 mt-4">
                  Stay Connected
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Tech that fits your wrist
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default Hero;