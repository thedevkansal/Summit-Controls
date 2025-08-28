import React from "react";
import { QrCode, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import summitLogo from "../assets/summit.svg"; // <-- Import the logo

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="relative w-full flex-grow flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* --- THE FIX: Increased opacity to make the logo more visible --- */}
      <img
        src={summitLogo}
        alt="E-Summit Background Logo"
        className="absolute top-1/2 left-1/2 
             -translate-x-1/2 -translate-y-1/2 
             w-2/3 max-w-md h-auto 
             z-0 opacity-40"
      />

      {/* Main Content */}
      <motion.div
        className="z-10 flex flex-col items-center text-center max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-5 py-2 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
            E-Summit 2024 Controls
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-slate-400"
        >
          Verification Portal
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-8 text-lg md:text-xl text-slate-400 leading-relaxed"
        >
          Streamline participant entry with instant QR code verification and
          on-the-spot ID card printing.
        </motion.p>

        <motion.div variants={itemVariants} className="mt-12">
          <Link
            to="/scan"
            className="group relative flex items-center justify-center gap-3 rounded-full bg-indigo-600 px-10 py-5 text-lg font-semibold text-white shadow-xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            <QrCode className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-12" />
            <span>Scan QR</span>
            <ArrowRight className="h-6 w-6 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
