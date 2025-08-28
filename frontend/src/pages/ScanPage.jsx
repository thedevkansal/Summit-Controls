import React, { useState } from 'react';
import { Search, UserCheck, XCircle, Loader2, QrCode, Camera, Printer, CheckCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import IdCardPreview from '../components/IdCardPreview';
import QrScanner from '../components/QrScanner';
import { getParticipantById, checkInParticipant } from '../utils/api';

const ScanPage = () => {
  const [uid, setUid] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [verifiedData, setVerifiedData] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleVerify = async (scannedId) => {
    const idToVerify = scannedId || uid;
    if (!idToVerify) return;

    setStatus('loading');
    setVerifiedData(null);
    setErrorMsg('');

    try {
      const participantData = await getParticipantById(idToVerify);
      setVerifiedData(participantData);
      setStatus('success');
    } catch (error) {
      setErrorMsg(error.message || 'Participant not found.');
      setStatus('error');
    }
  };

  const handleScanSuccess = (decodedText) => {
    setUid(decodedText);
    setIsScannerOpen(false);
    setTimeout(() => handleVerify(decodedText), 100);
  };

  const handleCheckInAndPrint = async () => {
    if (status === 'success' && verifiedData) {
      try {
        await checkInParticipant(verifiedData.id);
        window.print();
        // Refresh data to show updated 'Printed' status if user scans again
        handleVerify(verifiedData.id); 
      } catch (error) {
        setErrorMsg('Failed to update check-in status. Please try again.');
        setStatus('error');
      }
    }
  };

  return (
    <>
      <style>{`
        .printable-area { display: none; }
        @media print {
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area {
            display: block; position: absolute; left: 0; top: 0; width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
          }
          .id-card-content { -webkit-print-color-adjust: exact; color-adjust: exact; transform: scale(1.1); }
        }
      `}</style>
      
      {verifiedData && (
        <div className="printable-area">
          <IdCardPreview participant={verifiedData} />
        </div>
      )}

      {isScannerOpen && (
        <QrScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setIsScannerOpen(false)}
        />
      )}

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 p-4">
        {/* Left Panel */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div>
            <h2 className="text-4xl font-bold text-slate-100 tracking-tight">
              Participant Verification
            </h2>
            <p className="mt-2 text-slate-400">
              Scan the QR code or enter the ID manually to verify.
            </p>
            <div className="relative mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="e.g., pay_..."
                className="w-full rounded-full border-2 border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-base text-white transition-colors focus:border-indigo-500 focus:outline-none focus:ring-0"
              />
            </div>
            
            {/* --- THE FIX: Changed button container and removed w-full --- */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-indigo-700"
              >
                <Camera className="h-6 w-6" />
                <span>Scan</span>
              </button>
              <button
                onClick={() => handleVerify()}
                disabled={!uid || status === 'loading'}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-slate-700 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === 'loading' ? <Loader2 className="h-6 w-6 animate-spin" /> : <UserCheck className="h-6 w-6" />}
                <span>Verify</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/50 p-6 min-h-[500px]">
          <AnimatePresence>
            {status === 'idle' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center text-slate-500">
                <QrCode className="mx-auto h-16 w-16" />
                <p className="mt-4 text-lg">Verification results will appear here.</p>
              </motion.div>
            )}
            {status === 'success' && verifiedData && (
              <div className="flex flex-col items-center gap-6 w-full">
                {/* --- THE FIX: A separate, prominent status badge --- */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`w-full text-center p-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    verifiedData.checkInStatus === 'Printed'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-green-500/10 text-green-400'
                  }`}
                >
                  {verifiedData.checkInStatus === 'Printed' ? <HelpCircle /> : <CheckCircle />}
                  Status: {verifiedData.checkInStatus}
                </motion.div>

                <IdCardPreview participant={verifiedData} />
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <button
                    onClick={handleCheckInAndPrint}
                    className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-green-700"
                  >
                    <Printer className="h-6 w-6" />
                    <span>Check-In & Print ID</span>
                  </button>
                </motion.div>
              </div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center text-red-400">
                <XCircle className="mx-auto h-16 w-16" />
                <p className="mt-4 text-lg font-semibold">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ScanPage;
