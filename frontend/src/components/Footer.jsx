import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaPinterestP,
  FaTwitter,
  FaInstagram,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay,
} from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdLocalShipping, MdSupportAgent } from "react-icons/md";
import { BsShieldCheck, BsArrowReturnLeft } from "react-icons/bs";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
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

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer */}
      <motion.div
        className="px-4 sm:px-6 lg:px-8 py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & About */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900">Merbiz Store</h2>
            <p className="text-gray-600">
              Your one-stop shop for the latest tech gadgets and accessories at
              competitive prices.
            </p>
            <div className="flex space-x-4 pt-2">
              {[
                {
                  icon: <FaFacebookF />,
                  label: "Facebook",
                  color: "hover:text-blue-600",
                },
                {
                  icon: <FaTwitter />,
                  label: "Twitter",
                  color: "hover:text-black",
                },
                {
                  icon: <FaPinterestP />,
                  label: "Pinterest",
                  color: "hover:text-red-600",
                },
                {
                  icon: <FaInstagram />,
                  label: "Instagram",
                  color: "hover:text-pink-600",
                },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href="#"
                  className={`${social.color} transition-colors duration-200 text-lg`}
                  aria-label={`Visit our ${social.label}`}
                  variants={itemVariants}
                  custom={index * 0.1}
                  whileHover={{ y: -3, scale: 1.1 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} custom={0.1}>
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-3">
              {[
                "New Arrivals",
                "Best Sellers",
                "Deals & Offers",
                "Gift Cards",
                "Clearance",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  variants={itemVariants}
                  custom={0.1 + index * 0.05}
                  whileHover={{ x: 5 }}
                >
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors duration-200"
                    aria-label={`Go to ${item}`}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants} custom={0.2}>
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Help</h4>
            <ul className="space-y-3">
              {[
                "Contact Us",
                "FAQs",
                "Shipping Info",
                "Returns & Exchanges",
                "Order Tracking",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  variants={itemVariants}
                  custom={0.2 + index * 0.05}
                  whileHover={{ x: 5 }}
                >
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors duration-200"
                    aria-label={`Go to ${item}`}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* About */}
          <motion.div variants={itemVariants} custom={0.3}>
            <h4 className="font-semibold text-lg text-gray-900 mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Careers",
                "Blog",
                "Privacy Policy",
                "Terms of Service",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  variants={itemVariants}
                  custom={0.3 + index * 0.05}
                  whileHover={{ x: 5 }}
                >
                  <a
                    href="#"
                    className="hover:text-gray-900 transition-colors duration-200"
                    aria-label={`Go to ${item}`}
                  >
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            className="space-y-4"
            variants={itemVariants}
            custom={0.4}
          >
            <h4 className="font-semibold text-lg text-gray-900">Contact Us</h4>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span>
                  <span className="block text-gray-500">Phone:</span>
                  <a
                    href="tel:+18005551234"
                    className="font-medium hover:text-blue-600"
                  >
                    +1 (800) 555-1234
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span>
                  <span className="block text-gray-500">Email:</span>
                  <a
                    href="mailto:support@merbiz.com"
                    className="font-medium hover:text-blue-600"
                  >
                    support@merbiz.com
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span>
                  <span className="block text-gray-500">Address:</span>
                  <span>123 Tech Street, Silicon Valley, CA 94025</span>
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="bg-gray-100 py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <RiSecurePaymentLine className="text-xl" />
              <span>Secure Payment</span>
            </div>

            <div className="flex items-center gap-4">
              {[
                { icon: <FaCcVisa />, label: "Visa" },
                { icon: <FaCcMastercard />, label: "Mastercard" },
                { icon: <FaCcPaypal />, label: "PayPal" },
                { icon: <FaCcApplePay />, label: "Apple Pay" },
              ].map((payment, index) => (
                <motion.div
                  key={payment.label}
                  className="text-2xl text-gray-700"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  {payment.icon}
                </motion.div>
              ))}
            </div>

            <p className="text-sm text-gray-500 text-center md:text-right">
              © {currentYear} Merbiz Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
