import React from "react";
import { FaTruck, FaMoneyBillWave, FaHeadset, FaPercent } from "react-icons/fa";
import { motion } from "framer-motion";

const Features = () => {
  const features = [
    {
      icon: <FaTruck className="text-xl text-blue-600" />,
      title: "Free Shipping & Returns",
      description:
        "Shop with confidence and have your favorite electronics delivered right to your doorstep without any additional cost.",
    },
    {
      icon: <FaMoneyBillWave className="text-xl text-blue-600" />,
      title: "Money Back Guarantee",
      description:
        "If you're not completely satisfied with your purchase, we'll make it right. No questions asked.",
    },
    {
      icon: <FaHeadset className="text-xl text-blue-600" />,
      title: "Online Support 24/7",
      description:
        "Need help with your electronics? Get in touch with us anytime, anywhere, and let's get your tech sorted.",
    },
    {
      icon: <FaPercent className="text-xl text-blue-600" />,
      title: "Regular Sales",
      description:
        "Don't miss out on our amazing deals with regular sales on our top-of-the-line electronics.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={container}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{
              y: -5,
              transition: { duration: 0.2 },
            }}
            className="flex items-start gap-4 px-6 py-8 text-left"
          >
            <motion.div
              className="bg-white rounded-md p-2"
              whileHover={{ scale: 1.1 }}
            >
              {feature.icon}
            </motion.div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Features;
