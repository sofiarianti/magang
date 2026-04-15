import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

const buildUniquePayloads = (basePayload, catatan) => {
  const variants = [
    {
      ...basePayload,
      ...(catatan ? { catatan } : {}),
    },
    {
      kode_transaksi: basePayload.kode_transaksi,
      kode_donatur: basePayload.kode_donatur,
      kode_jenis_donasi: basePayload.kode_jenis_donasi,
      kode_detail_donasi: basePayload.kode_detail_donasi,
      kode_himpun: basePayload.kode_himpun,
      kode_detail_himpun: basePayload.kode_detail_himpun,
      jumlah: basePayload.jumlah,
      status: basePayload.status,
      ...(catatan ? { catatan } : {}),
    },
    {
      kode_transaksi: basePayload.kode_transaksi,
      kode_donatur: basePayload.kode_donatur,
      kode_jenis_donasi: basePayload.kode_jenis_donasi,
      kode_detail_donasi: basePayload.kode_detail_donasi,
      kode_himpun: basePayload.kode_himpun,
      kode_detail_transaksi: basePayload.kode_detail_transaksi,
      jumlah: basePayload.jumlah,
      status: basePayload.status,
      ...(catatan ? { catatan } : {}),
    },
    {
      kode_transaksi: basePayload.kode_transaksi,
      kode_donatur: basePayload.kode_donatur,
      kode_jenis_donasi: basePayload.kode_jenis_donasi,
      kode_detail_donasi: basePayload.kode_detail_donasi,
      kode_himpun: basePayload.kode_himpun,
      jumlah_donasi: basePayload.jumlah_donasi,
      ...(catatan ? { catatan } : {}),
    },
  ];

  const seen = new Set();
  return variants.filter((variant) => {
    Object.keys(variant).forEach((key) => {
      if (variant[key] === undefined || variant[key] === null || variant[key] === '') {
        delete variant[key];
      }
    });

    const signature = JSON.stringify(variant);
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
};

/**
 * @returns { Object } - Mengembalikan fungsi postDonatur, serta status loading dan error.
 */
const usePostTransaksi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fungsi untuk mengirim data ke backend.
   * Status transaksi dibuat "pending" saat awal. Jika pembayaran dikonfirmasi admin, status diperbarui menjadi "success".
   * @param { string } kode_transaksi
   * @param { string } kode_donatur
   * @param { string } kode_jenis_donasi
   * @param { string } kode_detail_donasi
   * @param { string } kode_user
   * @param { string } kode_himpun
   * @param { string } kode_detail_transaksi
   * @param { string } jumlah_donasi
   * @param { string } [status='pending'] - Status awal transaksi
   * @param { string } catatan
   * @param { number | null } isRegister
   * @param { string } metodePembayaran
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postTransaksi = async (
    kode_transaksi,
    kode_donatur,
    kode_jenis_donasi,
    kode_detail_donasi,
    kode_user,
    kode_himpun,
    kode_detail_transaksi,
    jumlah_donasi,
    status = 'pending',
    catatan,
    isRegister = null,
    metodePembayaran = '',
    jalurPembayaran = ''
  ) => {
    setLoading(true);
    setError(null);

    try {
      const normalizedJumlahDonasi = Number(jumlah_donasi);
      const sanitizedCatatan = catatan && String(catatan).trim() ? String(catatan).trim() : '';
      const basePayload = {
        kode_transaksi: String(kode_transaksi || '').trim(),
        kode_donatur: String(kode_donatur || '').trim(),
        kode_jenis_donasi: String(kode_jenis_donasi || '').trim(),
        kode_detail_donasi: String(kode_detail_donasi || '').trim(),
        kode_user: kode_user && String(kode_user).trim() ? String(kode_user).trim() : undefined,
        kode_himpun: kode_himpun && String(kode_himpun).trim() ? String(kode_himpun).trim() : undefined,
        kode_detail_transaksi:
          kode_detail_transaksi && String(kode_detail_transaksi).trim()
            ? String(kode_detail_transaksi).trim()
            : undefined,
        kode_detail_himpun:
          kode_detail_transaksi && String(kode_detail_transaksi).trim()
            ? String(kode_detail_transaksi).trim()
            : undefined,
        jumlah_donasi: normalizedJumlahDonasi,
        jumlah: normalizedJumlahDonasi,
        status: String(status || 'pending').trim() || 'pending',
        status_transaksi: String(status || 'pending').trim() || 'pending',
      };

      // Validate critical fields
      if (!basePayload.kode_donatur || basePayload.kode_donatur.trim() === '') {
        throw new Error('Kode donatur tidak boleh kosong.');
      }
      if (!basePayload.kode_jenis_donasi || basePayload.kode_jenis_donasi.trim() === '') {
        throw new Error('Jenis donasi tidak valid.');
      }
      if (!basePayload.kode_detail_donasi || basePayload.kode_detail_donasi.trim() === '') {
        throw new Error('Detail donasi tidak valid.');
      }
      if (!basePayload.kode_himpun || basePayload.kode_himpun.trim() === '') {
        throw new Error('Metode pembayaran belum dipilih.');
      }
      if (!basePayload.jumlah_donasi || Number(basePayload.jumlah_donasi) <= 0) {
        throw new Error('Nominal donasi harus lebih dari 0.');
      }

      const payloadVariants = buildUniquePayloads(basePayload, sanitizedCatatan);
      let lastError = null;

      console.log('Payload transaksi yang dikirim:', {
        ...basePayload,
        meta_frontend: {
          metodePembayaran,
          jalurPembayaran,
          isRegister,
        },
        payloadVariants,
      });

      for (const [index, payload] of payloadVariants.entries()) {
        try {
          console.log(`Mencoba payload transaksi varian #${index + 1}`, payload);
          const response = await api.post(endpoints.transaksi.create, payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          return response.data;
        } catch (err) {
          lastError = err;
          console.warn(`Payload transaksi varian #${index + 1} gagal`, {
            status: err.response?.status,
            responseData: err.response?.data,
          });
        }
      }

      throw lastError || new Error('Gagal membuat transaksi.');
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Terjadi kesalahan saat mengupload data.';

      console.error('Error uploading data:', err);
      console.error('Error Details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        responseDataString:
          typeof err.response?.data === 'object'
            ? JSON.stringify(err.response?.data)
            : String(err.response?.data || ''),
        requestPayload: {
          kode_transaksi,
          kode_donatur,
          kode_jenis_donasi,
          kode_detail_donasi,
          kode_user,
          kode_himpun,
          kode_detail_transaksi,
          jumlah_donasi,
          status,
          catatan,
          isRegister,
          metodePembayaran,
          jalurPembayaran,
          attemptedVariants: true,
        },
      });
      setError(errorMessage);

      const enrichedError = new Error(errorMessage);
      enrichedError.response = err.response;
      enrichedError.requestPayload = {
        kode_transaksi,
        kode_donatur,
        kode_jenis_donasi,
        kode_detail_donasi,
        kode_user,
        kode_himpun,
        kode_detail_transaksi,
        jumlah_donasi,
        status,
        catatan,
        isRegister,
        metodePembayaran,
        jalurPembayaran,
      };
      throw enrichedError;
    } finally {
      setLoading(false);
    }
  };

  return { postTransaksi, loading, error };
};

export default usePostTransaksi;
