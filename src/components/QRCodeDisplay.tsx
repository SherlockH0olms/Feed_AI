import React, { useEffect, useState } from 'react';
import { generateQRCode } from '../utils/qrcode';
import { Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCodeDisplayProps {
  url: string;
  title?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ url, title = "Scan to access form" }) => {
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    generateQRCode(url).then(setQrCode);
  }, [url]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL');
    }
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {qrCode && (
        <div className="mb-4">
          <img 
            src={qrCode} 
            alt="QR Code" 
            className="mx-auto border border-gray-200 rounded-lg"
          />
        </div>
      )}
      
      <div className="text-sm text-gray-600 mb-4 break-all">
        {url}
      </div>
      
      <div className="flex justify-center space-x-2">
        <button
          onClick={copyUrl}
          className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
        >
          <Copy className="h-4 w-4" />
          <span>Copy URL</span>
        </button>
        
        <button
          onClick={openInNewTab}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-medium text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Open</span>
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;