import { useState } from 'react';
import api from '../Services/api';
import endpoints from '../Services/endpointUser';

/**
 * @returns { Object } - Mengembalikan fungsi postDonatur, serta status loading dan error.
 */
const usePostDonatur = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateGuestNik = () => {
    const timestampPart = Date.now().toString().slice(-10);
    const randomPart = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    return `${timestampPart}${randomPart}`;
  };

  const buildValidationMessage = (responseData) => {
    const baseMessage =
      responseData?.error ||
      responseData?.message ||
      'Terjadi kesalahan saat mengupload data.';
    const validationErrors = responseData?.errors;

    if (!validationErrors || typeof validationErrors !== 'object') {
      return baseMessage;
    }

    const flatErrors = Object.entries(validationErrors)
      .flatMap(([field, messages]) => {
        if (Array.isArray(messages)) {
          return messages.map((message) => `${field}: ${message}`);
        }

        if (messages) {
          return [`${field}: ${messages}`];
        }

        return [];
      })
      .filter(Boolean);

    return flatErrors.length ? `${baseMessage} - ${flatErrors.join(' | ')}` : baseMessage;
  };

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
   * @param { number | null } isRegister
   * @returns { Promise<Object> } - Mengembalikan data respons dari backend atau error.
   */
  const postDonatur = async (nik, nama, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, status_perkawinan, pekerjaan, kewarganegaraan, no_hp, email, password, isRegister = null) => {
    setLoading(true);
    setError(null);

    try {
      const isGuestDonatur = Number(isRegister) === 0;
      const sanitizedNama = String(nama || '').trim() || 'Donatur Tamu';
      const sanitizedPhone = String(no_hp || '').trim();
      const sanitizedEmail = String(email || '').trim();
      const sanitizedPassword = String(password || '').trim();
      const guestNik = String(nik || '').trim() || generateGuestNik();
      const registerPayload = {
        nik: String(nik || '').trim() || null,
        nama: sanitizedNama,
        alamat: String(alamat || '').trim() || '-',
        tempat_lahir: String(tempat_lahir || '').trim() || '-',
        tanggal_lahir: String(tanggal_lahir || '').trim() || '2000-01-01',
        jenis_kelamin: String(jenis_kelamin || '').trim() || 'Laki-laki',
        agama: String(agama || '').trim() || 'Islam',
        status_perkawinan: String(status_perkawinan || '').trim() || 'Belum Menikah',
        pekerjaan: String(pekerjaan || '').trim() || '-',
        kewarganegaraan: String(kewarganegaraan || '').trim() || 'Indonesia',
        no_hp: sanitizedPhone,
        email: sanitizedEmail,
        password: sanitizedPassword,
      };

      const guestPayloadVariants = [
        {
          nik: guestNik,
          nama: sanitizedNama,
          alamat: '',
          tempat_lahir: '',
          tanggal_lahir: '',
          jenis_kelamin: String(jenis_kelamin || '').trim(),
          agama: '',
          status_perkawinan: '',
          pekerjaan: '',
          kewarganegaraan: '',
          no_hp: sanitizedPhone,
          email: sanitizedEmail,
          password: '',
        },
        {
          nik: guestNik,
          nama: sanitizedNama,
          alamat: '-',
          tempat_lahir: '-',
          tanggal_lahir: '2000-01-01',
          jenis_kelamin: String(jenis_kelamin || '').trim() || 'Laki-laki',
          agama: 'Islam',
          status_perkawinan: 'Belum Menikah',
          pekerjaan: '-',
          kewarganegaraan: 'Indonesia',
          no_hp: sanitizedPhone,
          email: sanitizedEmail,
          password: `Guest-${Date.now()}-Pwd`,
        },
      ];

      const payloadVariants = isGuestDonatur ? guestPayloadVariants : [registerPayload];
      let lastError = null;

      for (let index = 0; index < payloadVariants.length; index += 1) {
        const data = {
          ...payloadVariants[index],
        };

        if (isRegister !== null && isRegister !== undefined) {
          data.isRegister = Number(isRegister);
          data.is_register = Number(isRegister);
        }

        console.log(`Payload donatur varian #${index + 1} yang dikirim:`, data);

        try {
          const response = await api.post(endpoints.donatur.create, data, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          return response.data;
        } catch (variantError) {
          lastError = variantError;
          console.error(`Payload donatur varian #${index + 1} gagal:`, {
            status: variantError.response?.status,
            responseData: variantError.response?.data,
            responseDataString: JSON.stringify(variantError.response?.data || {}),
          });
        }
      }

      throw lastError || new Error('Gagal mengupload data donatur.');
    } catch (err) {
      console.error('Error uploading data:', err);
      console.error('Error details donatur:', {
        status: err.response?.status,
        responseData: err.response?.data,
        responseDataString: JSON.stringify(err.response?.data || {}),
      });
      setError(buildValidationMessage(err.response?.data));
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postDonatur, loading, error };
};

export default usePostDonatur;
