import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postQr_code, serta status loading dan error.
 */
const usePostQr_code = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * Status transaksi dibuat "pending" saat awal. Jika pembayaran dikonfirmasi admin, status diperbarui menjadi "success".
   * @param { string } nama_qrcode
   * @param { string } jenis_qrcode
   * @param { string } image_qrcode             
   * @param { string } nominal_default
   * @param { string } is_active
   * @param { string } keterangan    
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postQr_code = async (nama_qrcode, jenis_qrcode, image_qrcode, nominal_default, is_active, keterangan) => {
    setLoading(true);
    setError(null); 

    try {
      // Membuat objek data untuk dikirim
      const data = {
        nama_qrcode,
        jenis_qrcode,
        image_qrcode,
        nominal_default,
        is_active,
        keterangan,
      };

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.qrcode.create, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error uploading data:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mengupload data.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postQr_code  , loading, error };
};

export default usePostQr_code;