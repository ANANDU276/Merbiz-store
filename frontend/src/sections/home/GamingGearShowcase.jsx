import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../api/productsApi";
import ProductCard from "../../components/ProductCard";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { CategoryContext } from "../../context/CategoryContext";
import { useContext } from "react";

const GamingGearShowcase = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { setSelectedCategory } = useContext(CategoryContext);


    useEffect(() => {
        const getGamingProducts = async () => {
            try {
                const allProducts = await fetchProducts();
                const gamingProducts = allProducts.filter(
                    (product) => product.category === "Gaming Gear"
                );

                if (gamingProducts.length > 0) {
                    // Shuffle the gaming products and get the first 6
                    const shuffledProducts = gamingProducts.sort(() => 0.5 - Math.random());
                    setProducts(shuffledProducts.slice(0, 6));
                } else {
                    setProducts([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        getGamingProducts();
    }, []);

    if (loading) {
        return (
            <motion.div
                className="min-h-[40vh] flex justify-center items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.div
                    className="h-10 w-10 rounded-full border-t-2 border-green-500"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="text-red-500 text-center py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <p>Error loading gaming gear</p>
                <p className="text-sm">{error}</p>
            </motion.div>
        );
    }

    if (!loading && products.length === 0) {
        return (
            <motion.section
                className="px-4 py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-center py-10">
                    <h2 className="text-xl font-medium text-gray-700 mb-2">
                        No gaming products found
                    </h2>
                    <p className="text-gray-500 mb-4">
                        We couldn't find any products in the Gaming Gear category at the moment.
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }}>
                        <Link
                            to="/shop"
                            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            Browse All Products <FaArrowRight className="inline ml-1" />
                        </Link>
                    </motion.div>
                </div>
            </motion.section>
        );
    }

    return (
        <motion.section
            className="px-4 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex items-center justify-between mb-8">
                <motion.h2
                    className="text-2xl font-bold text-gray-900"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Featured Gaming Gear
                </motion.h2>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ x: 5 }}
                >
                    <Link
                        to="/productpage"
                        onClick={() => setSelectedCategory("gaming gear")}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        View all <FaArrowRight className="ml-1" />
                    </Link>
                </motion.div>
            </div>

            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <AnimatePresence>
                    {products.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index * 0.05, 0.4) }}
                            whileHover={{ y: -5 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.section>
    );
};

export default GamingGearShowcase;