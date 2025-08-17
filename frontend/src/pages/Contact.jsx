import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  // Animation variants (consistent with other pages)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus({ submitting: false, submitted: true, error: null });
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, submitted: false }));
      }, 5000);
    } catch (error) {
      setFormStatus({ submitting: false, submitted: false, error: 'Failed to send message. Please try again.' });
    }
  };

  const CONTACT_METHODS = [
    {
      icon: <FaPhoneAlt className="h-6 w-6" />,
      title: "Phone",
      description: "Available 24/7 for your convenience",
      detail: "+1 (800) 123-4567"
    },
    {
      icon: <FaEnvelope className="h-6 w-6" />,
      title: "Email",
      description: "We'll respond within 24 hours",
      detail: "support@shopease.com"
    },
    {
      icon: <FaMapMarkerAlt className="h-6 w-6" />,
      title: "Headquarters",
      description: "123 Commerce Street, Suite 100",
      detail: "San Francisco, CA 94103"
    }
  ];

  const FAQS = [
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can use this number on our website or the carrier's website to track your package."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be unused and in their original packaging. Some exclusions apply."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination."
    },
    {
      question: "How do I contact customer service?",
      answer: "You can reach our customer service team 24/7 by phone at 1-800-123-4567 or by email at support@shopease.com."
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
              Contact Us
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mt-6 max-w-3xl mx-auto text-xl text-gray-300"
            >
              We're here to help and answer any questions you might have.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {CONTACT_METHODS.map((method, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-50 text-blue-600 mb-4 mx-auto">
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900">{method.title}</h3>
              <p className="mt-2 text-base text-center text-gray-600">
                {method.description}
              </p>
              <p className="mt-3 text-lg font-medium text-center text-blue-600">
                {method.detail}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Contact Form and Hours */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 lg:mb-0"
          >
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                Get In Touch
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              {formStatus.submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-medium">Thank you for your message!</p>
                  <p className="text-green-700 mt-1">We'll get back to you as soon as possible.</p>
                </div>
              ) : formStatus.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">Error sending message</p>
                  <p className="text-red-700 mt-1">{formStatus.error}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="py-3 px-4 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="py-3 px-4 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="py-3 px-4 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="py-3 px-4 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {formStatus.submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Business Hours and Social */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
          >
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
              Information
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Business Hours</h2>
            
            <div className="space-y-6">
              <div className="flex bg-gray-50 p-5 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FaClock className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Support</h3>
                  <p className="mt-1 text-gray-600">24 hours a day, 7 days a week</p>
                </div>
              </div>

              <div className="flex bg-gray-50 p-5 rounded-lg">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FaClock className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Corporate Office</h3>
                  <p className="mt-1 text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM PST</p>
                  <p className="mt-1 text-gray-600">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Connect With Us</h2>
              <div className="flex space-x-4">
                {[
                  { icon: <FaFacebook className="h-6 w-6" />, label: "Facebook" },
                  { icon: <FaTwitter className="h-6 w-6" />, label: "Twitter" },
                  { icon: <FaInstagram className="h-6 w-6" />, label: "Instagram" },
                  { icon: <FaLinkedin className="h-6 w-6" />, label: "LinkedIn" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    whileHover={{ y: -3 }}
                  >
                    <span className="sr-only">{social.label}</span>
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Us</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1563634197546!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Google Maps Location"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
              Help Center
            </span>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </motion.div>

          <motion.div
            className="mt-12 max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <dl className="space-y-4">
              {FAQS.map((faq, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                  whileHover={{ y: -3 }}
                >
                  <dt className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-gray-600">
                    {faq.answer}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-20 relative overflow-hidden">
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
              Still Have Questions?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
              Our customer support team is always ready to help.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Contact Support <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-200 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Visit Help Center
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;