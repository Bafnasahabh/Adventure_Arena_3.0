import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, RefreshCcw } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export const QRScanner = ({ onScan, onClose }: QRScannerProps) => {

  const [error, setError] = useState('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStoppedRef = useRef(false);

  useEffect(() => {
    isStoppedRef.current = false;
    startScanner();

    return () => {
      stopScanner();
    };
  }, [facingMode]);

  const startScanner = async () => {
    try {
      if (!window.isSecureContext) {
        // Mobile browsers often require HTTPS/secure context to allow camera access.
        setError(
          'Camera access requires HTTPS. Please open the site using an HTTPS URL (e.g., ngrok) or enable permission in browser settings.'
        );
        return;
      }

      // Clean up previous instance if exists
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      }

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (!isStoppedRef.current) {
            isStoppedRef.current = true;
            onScan(decodedText);
            stopScanner();
          }
        },
        () => {
          // Ignore general scan errors (happens when no QR code is in frame)
        }
      );

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg ? `Failed to start camera: ${msg}` : 'Failed to start camera. Please check permissions.');
      console.error('Camera start error:', err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleClose = async () => {
    isStoppedRef.current = true;
    await stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-stone-900 rounded-lg border-2 border-amber-700 overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-amber-900/50 border-b-2 border-amber-700">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-300" />
            <h2 className="text-xl font-bold text-amber-300">Scan Pirate Mark</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-amber-300 hover:text-amber-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="text-center text-red-400 p-8">
              <p>{error}</p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div id="qr-reader" className="w-full rounded-lg overflow-hidden border-2 border-amber-800"></div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
                <p className="text-amber-200 text-sm mb-4 sm:mb-0">
                  Point your spyglass (camera) at a QR code
                </p>
                <button
                  onClick={toggleCamera}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-800 border-2 border-amber-700 text-amber-300 hover:bg-stone-700 rounded-lg transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Flip Camera
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
