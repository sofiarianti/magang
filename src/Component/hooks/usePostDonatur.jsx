import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postDonatur, serta status loading dan error.
 */
const usePostDonatur = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * @param { string } nik 
   * @param { string } nama 
   * @param { string } alamat 
   * @param { string } tempat_lahir
   * @param { string } tanggal_lahir
   * @param { string } jenis_kelamin
   * @param { string } agama
   * @param { string } status_perkawinan
   * @param { string } pekerjaan
   * @param { string } kewarganegaraan
   * @param { string } no_hp
   * @param { string } email
   * @param { string } password
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postDonatur = async (nik, nama, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, status_perkawinan, pekerjaan, kewarganegaraan, no_hp, email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Membuat objek data untuk dikirim
      const data = {
        nik,
        nama,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        agama,
        status_perkawinan,
        pekerjaan,
        kewarganegaraan,
        no_hp,
        email,
        password,
      };

      // Mengirim POST request ke endpoint yang sesuai
      const response = await api.post(endpoints.donatur.create, data, {
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

  return { postDonatur, loading, error };
};

export default usePostDonatur;