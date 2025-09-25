import QRCode from 'qrcode';

export const generateQRCode = async (url: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: {
        dark: '#1f2937',
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
};