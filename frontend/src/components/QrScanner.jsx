import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, CameraOff, Loader2 } from "lucide-react";

const QrScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);
  const startedRef = useRef(false); // <-- track scanner state manually
  const [status, setStatus] = useState("initializing"); // plain JS

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader-container");
    scannerRef.current = html5QrCode;

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    const qrCodeSuccessCallback = (decodedText) => {
      if (scannerRef.current && startedRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            startedRef.current = false; // mark stopped
            onScanSuccess(decodedText);
          })
          .catch(() => {}); // ignore double-stop errors
      }
    };

    html5QrCode
      .start({ facingMode: "environment" }, config, qrCodeSuccessCallback)
      .then(() => {
        startedRef.current = true;
        setStatus("scanning");
      })
      .catch((err) => {
        console.error("Unable to start QR scanner.", err);
        setStatus("error");
        if (err.name === "NotAllowedError") {
          setErrorMessage(
            "Camera permission denied. Please allow camera access in your browser and refresh."
          );
        } else {
          setErrorMessage(
            "Could not access camera. Try closing other apps using the camera."
          );
        }
      });

    return () => {
      if (scannerRef.current && startedRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
            startedRef.current = false;
          })
          .catch(() => {});
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-800 p-6 ring-1 ring-slate-700">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 rounded-full bg-slate-700 p-2 text-white transition-colors hover:bg-slate-600"
        >
          <X className="h-6 w-6" />
        </button>
        <h3 className="text-lg font-semibold text-white">
          Scan Participant QR Code
        </h3>

        <div className="mt-4 w-full h-[300px] rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
          {status === "error" ? (
            <div className="text-center text-red-400 p-4">
              <CameraOff className="mx-auto h-12 w-12" />
              <p className="mt-2 font-semibold">Camera Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {status === "initializing" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="mt-2">Initializing Camera...</p>
                </div>
              )}
              <div id="qr-reader-container" className="w-full h-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrScanner;
