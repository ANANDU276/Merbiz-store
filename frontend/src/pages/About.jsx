import React from 'react';
import { Link } from 'react-router-dom';
import { FaAward, FaHeadset, FaShippingFast, FaLeaf, FaHandsHelping } from 'react-icons/fa';
import { FiPackage, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import teamImage from '../assets/default-product-image.jpg';
import { motion } from 'framer-motion';

const About = () => {
  // Animation variants (consistent with Hero page)
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
    hidden: { y: 30, opacity: 0 },
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

  // Data arrays
  const VALUES = [
    {
      icon: <FaAward className="h-6 w-6" />,
      title: "Quality First",
      description: "We rigorously vet every product to ensure it meets our high standards."
    },
    {
      icon: <FaHeadset className="h-6 w-6" />,
      title: "Customer Focus",
      description: "Your satisfaction is our top priority with 24/7 dedicated support."
    },
    {
      icon: <FaShippingFast className="h-6 w-6" />,
      title: "Fast Delivery",
      description: "Optimized logistics network for same-day shipping on most orders."
    },
    {
      icon: <FaLeaf className="h-6 w-6" />,
      title: "Sustainability",
      description: "Eco-friendly packaging and carbon-neutral shipping options."
    }
  ];

  const STATS = [
    { number: "5M+", label: "Happy Customers" },
    { number: "100K+", label: "Products Available" },
    { number: "24/7", label: "Customer Support" },
    { number: "98%", label: "Positive Reviews" }
  ];

  const PROMISES = [
    {
      icon: <FiPackage className="h-5 w-5" />,
      title: "Hassle-Free Returns",
      description: "30-day no-questions-asked return policy for complete peace of mind."
    },
    {
      icon: <FaHandsHelping className="h-5 w-5" />,
      title: "Personalized Service",
      description: "Dedicated account managers for premium members and businesses."
    },
    {
      icon: <FiShoppingBag className="h-5 w-5" />,
      title: "Curated Selection",
      description: "Only 1 in 10 products make it through our quality screening."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 relative">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Our Story
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mt-6 max-w-3xl mx-auto text-xl text-gray-300"
            >
              Pioneering e-commerce excellence through innovation, quality, and customer-centric solutions.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="mb-16 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                Since 2015
              </span>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Redefining E-Commerce
              </h2>
              <p className="mt-6 text-lg leading-7 text-gray-600">
                Founded with a vision to transform digital commerce, we've grown from a startup to a market leader through relentless innovation and customer focus. Our journey reflects our commitment to excellence at every touchpoint.
              </p>
              <p className="mt-4 text-lg leading-7 text-gray-600">
                Today, we serve millions of customers with a curated selection of premium products, backed by industry-leading service standards and sustainable practices.
              </p>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]"
          >
            <img
              className="w-full h-full object-cover"
              src={teamImage}
              alt="Our leadership team"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="inline-block px-3 py-1 bg-white text-gray-900 text-xs font-semibold rounded-full">
                Our Leadership Team
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Our Values */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
              Our Foundation
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Core Values
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              The principles that guide every decision we make
            </p>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {VALUES.map((value, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50 text-blue-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-3 text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-600 py-24 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/10"
              >
                <p className="text-4xl font-bold text-white">{stat.number}</p>
                <p className="mt-3 text-lg font-medium text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Our Promise */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 lg:mb-0 order-last lg:order-first"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
                alt="Customer receiving package"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/10 to-transparent"></div>
            </div>
          </motion.div>
          <div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                Customer Commitment
              </span>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Our Unmatched Promise
              </h2>
              <div className="mt-8 space-y-6">
                {PROMISES.map((promise, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex bg-gray-50 p-5 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 text-blue-600">
                        {promise.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{promise.title}</h3>
                      <p className="mt-1 text-gray-600">
                        {promise.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Experience the Difference
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
              Join our community of satisfied customers today.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Shop Now <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-200 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;