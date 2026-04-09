// src/Component/hooks/usePutImage.js
import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * usePutDonatur adalah custom hook yang digunakan untuk memperbarui data donatur di backend.
 * @returns { Object } - Mengembalikan fungsi putDonatur, serta status loading dan error.
 */
const usePutDonatur = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
    * Fungsi untuk memperbarui data donatur di backend.
   * @param { number } id - ID donatur yang akan diperbarui.
   * @param { string } nik - NIK donatur.
   * @param { string } nama - Nama donatur.
   * @param { string } alamat - Alamat donatur.
   * @param { string } tempat_lahir - Tempat lahir donatur.
   * @param { string } tanggal_lahir - Tanggal lahir donatur.
   * @param { string } jenis_kelamin - Jenis kelamin donatur.
   * @param { string } agama - Agama donatur.
   * @param { string } status_perkawinan - Status perkawinan donatur.
   * @param { string } pekerjaan - Pekerjaan donatur.
   * @param { string } kewarganegaraan - Kewarganegaraan donatur.
   * @param { string } no_hp - No. HP donatur.
   * @param { string } email - Email donatur.
   * @param { string } password - Password donatur.
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const putDonatur = async (id, nik, nama, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, status_perkawinan, pekerjaan, kewarganegaraan, no_hp, email, password) => {
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

    // Defensive check untuk memastikan endpoints.donatur.update terdefinisi
      if (!endpoints.donatur || typeof endpoints.donatur.update !== 'function') {
        throw new Error('endpoints.donatur.update is not defined');
      }

      // Mengirim PUT request ke endpoint yang sesuai
      const response = await api.put(endpoints.donatur.update(id), data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Mengembalikan data respons jika berhasil
      return response.data;
    } catch (err) {
      console.error('Error updating donatur:', err);
      // Mengambil pesan error dari respons jika tersedia
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat memperbarui donatur.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { putDonatur, loading, error };
};

export default usePutDonatur;