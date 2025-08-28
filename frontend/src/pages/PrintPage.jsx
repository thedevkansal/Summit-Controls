import React, { useEffect } from "react";
import {
  Printer,
  QrCode,
  User,
  Building2,
  Phone,
  BedDouble,
  Ticket,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PrintPage = ({ participant }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!participant) {
      navigate("/scan");
    }
  }, [participant, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (!participant) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
      {/* --- THE FIX: More Robust Print-Specific Styles --- */}
      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 0; /* removes default browser margins */
          }

          body * {
            visibility: hidden;
          }

          #printable-id-card,
          #printable-id-card * {
            visibility: visible;
          }

          #printable-id-card {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%); /* center the card */
            box-shadow: none !important;
            border: none !important;
            margin: 0;
            padding: 0;
          }

          .id-card-content {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact; /* modern browsers */
          }
        }
      `}</style>

      <motion.div
        className="no-print"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-100">
          ID Card Preview
        </h2>
        <p className="text-center text-slate-400 mt-1">
          This is exactly what will be printed.
        </p>
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-8">
        {/* This outer div is now the printable area */}
        <div id="printable-id-card">
          {/* This inner div contains the actual card content */}
          <div className="id-card-content w-[320px] h-[512px] rounded-2xl bg-slate-900 shadow-2xl p-6 flex flex-col text-white font-sans ring-1 ring-slate-700">
            <div className="text-center border-b-2 border-slate-700 pb-3">
              <h3 className="text-xl font-extrabold text-indigo-400">
                E-SUMMIT 2024
              </h3>
              <p className="text-xs font-semibold text-slate-400 tracking-widest">
                PARTICIPANT ID
              </p>
            </div>

            <div className="flex flex-col items-center text-center my-auto">
              <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center ring-4 ring-indigo-500/50 mb-4">
                <User className="w-16 h-16 text-slate-500" />
              </div>
              <h4 className="text-2xl font-bold leading-tight">
                {participant.name}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-slate-400">
                <Building2 className="w-4 h-4" />
                <p className="text-sm">{participant.college}</p>
              </div>
            </div>

            <div className="text-xs space-y-2 border-t border-slate-700 pt-3">
              <div className="flex justify-between">
                <strong className="font-medium text-slate-400">Contact:</strong>{" "}
                <span className="font-mono">{participant.contact}</span>
              </div>
              <div className="flex justify-between">
                <strong className="font-medium text-slate-400">Gender:</strong>{" "}
                <span>{participant.gender}</span>
              </div>
              <div className="flex justify-between">
                <strong className="font-medium text-slate-400">
                  Pass Type:
                </strong>{" "}
                <span className="font-semibold text-indigo-400">
                  {participant.passType}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="font-medium text-slate-400">
                  Accommodation:
                </strong>{" "}
                <span>{participant.accommodation}</span>
              </div>
              <p className="text-center text-slate-500 font-mono pt-2">
                {participant.id}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          className="flex gap-4 no-print"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <button
            onClick={handlePrint}
            className="group flex items-center justify-center gap-3 rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            <Printer className="h-6 w-6" />
            <span>Print ID Card</span>
          </button>
          <button
            onClick={() => navigate("/scan")}
            className="group flex items-center justify-center gap-3 rounded-full bg-slate-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-slate-600"
          >
            <QrCode className="h-6 w-6" />
            <span>Scan Next</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PrintPage;
