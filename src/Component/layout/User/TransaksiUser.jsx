import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import useAPI from '../../hooks/useAPI';
import endpointsUser from '../../Services/endpointUser';
import usePostDonatur from '../../hooks/usePostDonatur';
import usePostTransaksi from '../../hooks/usePostTransaksi';
import useDeleteTransaksi from '../../hooks/useDeleteTransaksi';
import useDeleteDetail_transaksi from '../../hooks/useDeleteDetail_transaksi';
import useUpdateTransaksi from '../../hooks/useUpdateTransaksi';
import { addNotification } from '../../Services/notifikasi';
import api from '../../Services/api';

const FORCED_JENIS_ALIASES = {
  zakat: ['zakat'],
  'infaq-sedekah': ['infaq/sedekah', 'infaq', 'infak/sedekah', 'infak', 'sedekah'],
  wakaf: ['wakaf'],
};

function normalizeDonationLabel(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/infak/g, 'infaq')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeInlineText(value) {
  return String(value || '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findJenisDonasiByKey(jenisDonasiList, forcedJenisKey) {
  if (!forcedJenisKey) return null;

  const aliases = FORCED_JENIS_ALIASES[forcedJenisKey] || [forcedJenisKey];

  return (
    jenisDonasiList.find((item) => {
      const namaJenis = normalizeDonationLabel(
        item.nama_donasi ||
        item.nama ||
        item.nama_jenis ||
        ''
      );

      return aliases.some((alias) => namaJenis.includes(normalizeDonationLabel(alias)));
    }) || null
  );
}

function Transaksi({ user: userProp = null, forcedJenisKey = null }) {
  const location = useLocation();
  const {
    selectedJenis: initialSelectedJenis = null,
    selectedDetail: initialSelectedDetail = null,
    user: locationUser = null,
  } = location.state || {};
  const hasLocationKodeDonatur = Boolean(
    locationUser?.kode_donatur || locationUser?.donatur?.kode_donatur
  );
  const user =
    hasLocationKodeDonatur || !userProp
      ? (locationUser || userProp)
      : userProp;
  const isGuest = Boolean(user?.isGuest);

  const {
    data: jenisData,
    loading: loadingJenis,
    error: errorJenis,
  } = useAPI(endpointsUser.jenis_donasi.getAll);

  const {
    data: detailData,
    loading: loadingDetail,
    error: errorDetail,
  } = useAPI(endpointsUser.detail_donasi.getAll);

  const { data: donaturData } = useAPI(endpointsUser.donatur.getAll);

  // Ambil semua himpun (jalur/penghimpun) untuk menentukan kode_himpun
  const {
    data: himpunData,
    loading: loadingHimpun,
    error: errorHimpun,
  } = useAPI(endpointsUser.himpun.getAll);

  const {
    data: detailHimpunData,
    loading: loadingDetailHimpun,
    error: errorDetailHimpun,
  } = useAPI(endpointsUser.detail_himpun.getAll);

  // Ambil semua user admin/penghimpun untuk memetakan kode_himpun → user
  // Ambil QR code aktif dari /api/qrcode/active
  const {
    data: qrCodeData,
  } = useAPI(endpointsUser.qrcode.getActive);

  const [metodePembayaran, setMetodePembayaran] = useState('');
  const [selectedHimpunCode, setSelectedHimpunCode] = useState('');
  const [selectedPaymentDetailCode, setSelectedPaymentDetailCode] = useState('');
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [expandedPaymentMethodCode, setExpandedPaymentMethodCode] = useState('');
  const [nominal, setNominal] = useState('');
  const [catatanDonatur, setCatatanDonatur] = useState('');
  const [guestIdentity, setGuestIdentity] = useState({
    nama: user?.donatur?.nama || (user?.nama && user.nama !== 'Guest Donatur' ? user.nama : ''),
    jenis_kelamin: user?.donatur?.jenis_kelamin || user?.jenis_kelamin || '',
    no_hp: user?.donatur?.no_hp || user?.no_hp || '',
    email: user?.donatur?.email || user?.email || '',
  });
  const [selectedJenis, setSelectedJenis] = useState(initialSelectedJenis);
  const [selectedDetail, setSelectedDetail] = useState(initialSelectedDetail);
  const [donationItems, setDonationItems] = useState([]);
  const [submitMessage, setSubmitMessage] = useState('');
  const [createdCheckout, setCreatedCheckout] = useState(null);
  const [selectedQrCode, setSelectedQrCode] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrImageError, setQrImageError] = useState(false);
  const [qrImageBase64, setQrImageBase64] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [qrImageCandidates, setQrImageCandidates] = useState([]);
  const [qrImageCandidateIndex, setQrImageCandidateIndex] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const paymentDropdownRef = useRef(null);

  const {
    postDonatur,
  } = usePostDonatur();

  const {
    postTransaksi,
    loading: loadingTransaksi,
  } = usePostTransaksi();

  const {
    deleteTransaksi,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteTransaksi();

  const {
    deleteDetailTransaksi,
    // eslint-disable-next-line no-unused-vars
    loading: loadingDeleteDetail,
    // eslint-disable-next-line no-unused-vars
    error: errorDeleteDetail,
  } = useDeleteDetail_transaksi();

  const {
    putTransaksi,
    loading: loadingUpdateTransaksi,
  } = useUpdateTransaksi();

  // Normalisasi data himpun
  const himpunList = useMemo(() => {
    if (Array.isArray(himpunData?.himpun)) return himpunData.himpun;
    if (Array.isArray(himpunData)) return himpunData;
    if (Array.isArray(himpunData?.data)) return himpunData.data;
    if (himpunData && typeof himpunData === 'object' && !Array.isArray(himpunData)) return Object.values(himpunData);
    return [];
  }, [himpunData]);

  const detailHimpunList = useMemo(() => {
    if (Array.isArray(detailHimpunData?.detail_himpun)) return detailHimpunData.detail_himpun;
    if (Array.isArray(detailHimpunData)) return detailHimpunData;
    if (Array.isArray(detailHimpunData?.data)) return detailHimpunData.data;
    if (Array.isArray(detailHimpunData?.result)) return detailHimpunData.result;
    return [];
  }, [detailHimpunData]);

  const jenisDonasiList = useMemo(() => {
    if (Array.isArray(jenisData?.jenis_donasi)) return jenisData.jenis_donasi;
    if (Array.isArray(jenisData)) return jenisData;
    if (Array.isArray(jenisData?.data)) return jenisData.data;
    if (Array.isArray(jenisData?.result)) return jenisData.result;
    return [];
  }, [jenisData]);

  const detailDonasiList = useMemo(() => {
    if (Array.isArray(detailData?.detail_donasi)) return detailData.detail_donasi;
    if (Array.isArray(detailData)) return detailData;
    if (Array.isArray(detailData?.data)) return detailData.data;
    if (Array.isArray(detailData?.result)) return detailData.result;
    return [];
  }, [detailData]);

  const donaturList = useMemo(() => {
    if (Array.isArray(donaturData?.donatur)) return donaturData.donatur;
    if (Array.isArray(donaturData)) return donaturData;
    if (Array.isArray(donaturData?.data)) return donaturData.data;
    if (Array.isArray(donaturData?.result)) return donaturData.result;
    return [];
  }, [donaturData]);

  const getHimpunCode = (item) =>
    String(
      item?.kode_himpun ||
        item?.kode ||
        item?.kode_himpun_id ||
        item?.himpun?.kode_himpun ||
        ''
    ).trim();

  const getHimpunName = (item) =>
    normalizeInlineText(
      item?.nama_himpun ||
        item?.nama ||
        item?.himpun?.nama_himpun ||
        item?.himpun?.nama ||
        ''
    );

  const getDetailHimpunCode = (item) =>
    String(
      item?.kode_detail_himpun ||
        item?.kode_detail_himpun_himpun ||
        item?.kode_detail_transaksi ||
        item?.kode ||
        item?.kode_detail ||
        item?.id ||
        ''
    ).trim();

  const getDetailHimpunName = (item) =>
    normalizeInlineText(item?.nama || item?.nama_detail_himpun || '');

  const selectedHimpun = useMemo(
    () => himpunList.find((item) => getHimpunCode(item) === selectedHimpunCode) || null,
    [himpunList, selectedHimpunCode]
  );

  const filteredPaymentDetails = useMemo(() => {
    if (!selectedHimpunCode) return [];

    return detailHimpunList.filter((item) => {
      const itemKodeHimpun = String(
        item?.kode_himpun ||
          item?.himpun_kode ||
          item?.kode_himpun_id ||
          item?.himpun?.kode_himpun ||
          ''
      ).trim();

      return itemKodeHimpun === selectedHimpunCode;
    });
  }, [detailHimpunList, selectedHimpunCode]);

  const selectedPaymentDetail = useMemo(
    () => filteredPaymentDetails.find((item) => getDetailHimpunCode(item) === selectedPaymentDetailCode) || null,
    [filteredPaymentDetails, selectedPaymentDetailCode]
  );

  const paymentMethodsWithDetails = useMemo(
    () =>
      himpunList.map((item) => {
        const code = getHimpunCode(item);
        const details = detailHimpunList.filter((detail) => {
          const itemKodeHimpun = String(
            detail?.kode_himpun ||
              detail?.himpun_kode ||
              detail?.kode_himpun_id ||
              detail?.himpun?.kode_himpun ||
              ''
          ).trim();

          return itemKodeHimpun === code;
        });

        return {
          ...item,
          code,
          label: getHimpunName(item) || code,
          details,
        };
      }),
    [detailHimpunList, himpunList]
  );

  const isQrisMethod = useMemo(
    () => normalizeDonationLabel(getHimpunName(selectedHimpun) || metodePembayaran) === 'qris',
    [metodePembayaran, selectedHimpun]
  );

  const paymentDropdownLabel = useMemo(() => {
    if (selectedPaymentDetail) {
      return `${getHimpunName(selectedHimpun)} - ${getDetailHimpunName(selectedPaymentDetail)}`;
    }

    if (selectedHimpun) {
      return getHimpunName(selectedHimpun);
    }

    return 'Pilih metode pembayaran';
  }, [selectedHimpun, selectedPaymentDetail]);

  const forcedJenis = useMemo(
    () => findJenisDonasiByKey(jenisDonasiList, forcedJenisKey),
    [jenisDonasiList, forcedJenisKey]
  );

  const getDetailIdentity = (detail) =>
    String(
      detail?.id ||
        detail?.id_detail_donasi ||
        detail?.kode_detail_donasi ||
        detail?.kode ||
        detail?.kode_detail ||
        detail?.nama_detail_donasi ||
        detail?.nama ||
        ''
    );

  const filteredDetailByJenis = useMemo(() => {
    if (!selectedJenis) return [];

    const idJenis =
      selectedJenis.id ||
      selectedJenis.id_jenis_donasi ||
      selectedJenis.jenis_donasi_id;
    const kodeJenis =
      selectedJenis.kode_jenis_donasi ||
      selectedJenis.kode ||
      selectedJenis.kode_jenis;
    const namaJenis = (
      normalizeDonationLabel(
        selectedJenis.nama_donasi ||
        selectedJenis.nama ||
        selectedJenis.nama_jenis ||
        ''
      )
    );
    const namaJenisTokens = namaJenis.split(' ').filter(Boolean);

    return detailDonasiList.filter((detail) => {
      const matchById =
        idJenis &&
        (String(detail.id_jenis_donasi) === String(idJenis) ||
          String(detail.jenis_donasi_id) === String(idJenis));
      const matchByKode =
        kodeJenis &&
        (String(detail.kode_jenis_donasi) === String(kodeJenis) ||
          String(detail.kode_jenis) === String(kodeJenis));
      const detailJenisNama = normalizeDonationLabel(
        detail.jenis_donasi?.nama_donasi ||
        detail.jenis_donasi?.nama ||
        detail.jenisDonasi?.nama_donasi ||
        detail.jenisDonasi?.nama ||
        detail.nama_jenis_donasi ||
        detail.kategori ||
        ''
      );

      const detailNama = normalizeDonationLabel(
        detail.nama_detail_donasi ||
        detail.nama ||
        ''
      );

      const matchByNamaKategori =
        namaJenis &&
        (
          detailJenisNama.includes(namaJenis) ||
          detailNama.includes(namaJenis) ||
          namaJenisTokens.some((token) => detailJenisNama.includes(token)) ||
          namaJenisTokens.some((token) => detailNama.includes(token))
        );

      return matchById || matchByKode || matchByNamaKategori;
    });
  }, [detailDonasiList, selectedJenis]);

  const loading =
    loadingJenis ||
    loadingDetail ||
    loadingHimpun ||
    loadingDetailHimpun;

  const error =
    errorJenis ||
    errorDetail ||
    errorHimpun ||
    errorDetailHimpun;

  const formatCurrency = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

  const resetForm = () => {
    setNominal('');
    setMetodePembayaran('');
    setSelectedHimpunCode('');
    setSelectedPaymentDetailCode('');
    setIsPaymentDropdownOpen(false);
    setExpandedPaymentMethodCode('');
    setCatatanDonatur('');
    setSelectedJenis(forcedJenis || initialSelectedJenis);
    setSelectedDetail(null);
    setDonationItems([]);
    setSubmitMessage('');
    setSelectedQrCode(null);
    setQrImageUrl('');
    setQrImageCandidates([]);
    setQrImageCandidateIndex(0);
  };

  const handleGuestIdentityChange = (e) => {
    const { name, value } = e.target;
    setGuestIdentity((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (forcedJenisKey && forcedJenis) {
      setSelectedJenis(forcedJenis);
      setSelectedDetail(null);
      return;
    }

    if (!forcedJenisKey && initialSelectedJenis) {
      setSelectedJenis(initialSelectedJenis);
      setSelectedDetail(initialSelectedDetail);
    }
  }, [forcedJenisKey, forcedJenis, initialSelectedJenis, initialSelectedDetail]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!paymentDropdownRef.current?.contains(event.target)) {
        setIsPaymentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetAfterSuccess = () => {
    setTimeout(() => {
      setCreatedCheckout(null);
      resetForm();
    }, 5000);
  };

  const getNormalizedApiUrl = () => {
    const configuredUrl =
      api?.defaults?.baseURL ||
      process.env.REACT_APP_API_URL ||
      window.location.origin;
    return configuredUrl.replace(/\/$/, '');
  };

  const getQrImageCandidates = (imagePath) => {
    if (!imagePath) return [];

    const apiUrl = getNormalizedApiUrl();
    const apiOrigin = new URL(apiUrl, window.location.origin).origin;
    const rawPath = String(imagePath).trim();
    const cleanPath = rawPath.replace(/^\/+/, '');
    const fileName = cleanPath.split('/').pop();
    const candidates = [];

    const addCandidate = (value) => {
      if (value && !candidates.includes(value)) {
        candidates.push(value);
      }
    };

    if (/^https?:\/\//i.test(rawPath)) {
      addCandidate(rawPath);
      return candidates;
    }

    addCandidate(`${apiOrigin}/${cleanPath}`);
    addCandidate(`${apiUrl}/${cleanPath}`);

    if (cleanPath.startsWith('uploads/')) {
      addCandidate(`${apiUrl}/api/${cleanPath}`);
    }

    if (fileName) {
      addCandidate(`${apiOrigin}/uploads/qrcodes/${fileName}`);
      addCandidate(`${apiUrl}/uploads/qrcodes/${fileName}`);
      addCandidate(`${apiUrl}/api/uploads/qrcodes/${fileName}`);
    }

    return candidates;
  };

  const downloadQrCode = () => {
    if (!selectedQrCode) return;

    const link = document.createElement('a');
    
    // Jika ada qrImageBase64, gunakan itu
    if (qrImageBase64) {
      link.href = qrImageBase64;
      link.download = `QRIS-${selectedQrCode.id_qrcode || Date.now()}.jpeg`;
    } else if (qrImageUrl) {
      link.href = qrImageUrl;
      link.download = `QRIS-${selectedQrCode.id_qrcode || Date.now()}.jpeg`;
    } else {
      const imagePath =
        selectedQrCode.image_qrcode ||
        selectedQrCode.image_url ||
        selectedQrCode.image ||
        selectedQrCode.url ||
        selectedQrCode.qr_image;
      const [finalUrl] = getQrImageCandidates(imagePath);

      if (!finalUrl) {
        alert('QR Code tidak tersedia untuk diunduh');
        return;
      }

      link.href = finalUrl;
      link.download = `QRIS-${selectedQrCode.id_qrcode || Date.now()}.jpeg`;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // eslint-disable-next-line no-unused-vars
  const handleQrImageError = () => {
    console.error('QR Image failed to load');
    console.log('Attempted URL:', `${process.env.REACT_APP_API_URL}/${selectedQrCode?.image_qrcode}`);
    setQrImageError(true);
  };

  const handleQrDisplayError = () => {
    const nextIndex = qrImageCandidateIndex + 1;
    const nextUrl = qrImageCandidates[nextIndex];

    console.warn('QR image failed to render:', qrImageUrl);

    if (nextUrl) {
      console.log('Trying next QR image candidate:', nextUrl);
      setQrImageCandidateIndex(nextIndex);
      setQrImageUrl(nextUrl);
      return;
    }

    setQrImageError(true);
  };

  // eslint-disable-next-line no-unused-vars
  const fetchQrImage = async (imagePath) => {
    try {
      // Gunakan window.location.origin jika REACT_APP_API_URL tidak terdefinisi
      let baseUrl = process.env.REACT_APP_API_URL || window.location.origin;
      
      // Hapus trailing slash dari baseUrl untuk konsistensi
      baseUrl = baseUrl.replace(/\/$/, '');
      
      // Hapus leading slash dari imagePath
      const cleanPath = imagePath.replace(/^\//, '');
      
      // Konstruksi URL yang benar
      const fullUrl = `${baseUrl}/${cleanPath}`;
      
      console.log('=== QR Image Fetch Debug Info ===');
      console.log('Full URL to fetch:', fullUrl);
      console.log('Image path (original):', imagePath);
      console.log('Image path (cleaned):', cleanPath);
      console.log('Base URL:', baseUrl);
      console.log('REACT_APP_API_URL env:', process.env.REACT_APP_API_URL || '(not set)');
      console.log('window.location.origin:', window.location.origin);
      console.log('Backend needs to serve static files at /uploads/ OR have API endpoint for images');
      console.log('Current environment:', process.env.NODE_ENV);
      console.log('================================');
      
      const response = await fetch(fullUrl);
      
      console.log('Fetch response status:', response.status);
      console.log('Fetch response ok:', response.ok);
      console.log('Fetch response headers:', {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
      });
      
      if (!response.ok) {
        console.error('Failed to fetch QR image:', response.status, response.statusText);
        console.error('Failed URL:', fullUrl);
        
        // Try alternative URL patterns
        console.log('Attempting alternative URL patterns...');
        const altUrls = [
          `${baseUrl}/api/${cleanPath}`,  // With /api prefix
          `${window.location.origin}/${cleanPath}`,  // Direct from frontend origin
          `${window.location.origin}/api/${cleanPath}`,  // Frontend + /api
        ];
        
        for (const altUrl of altUrls) {
          console.log('Trying alternative URL:', altUrl);
          try {
            const altResponse = await fetch(altUrl);
            if (altResponse.ok) {
              const altBlob = await altResponse.blob();
              if (altBlob.type !== 'text/html') {
                console.log('✓ Success with alternative URL:', altUrl);
                const imageUrl = URL.createObjectURL(altBlob);
                setQrImageBase64(imageUrl);
                setQrImageError(false);
                return;
              }
            }
          } catch (altError) {
            console.log('Alternative URL failed:', altError.message);
          }
        }
        
        setQrImageError(true);
        return;
      }
      
      const blob = await response.blob();
      console.log('Blob received:', blob);
      console.log('Blob size:', blob.size);
      console.log('Blob type:', blob.type);
      
      // Cek apakah blob adalah HTML (error)
      if (blob.type === 'text/html') {
        console.error('Received HTML instead of image. File might not exist or permission denied.');
        console.error('Attempted URL:', fullUrl);
        const text = await blob.text();
        console.log('HTML response first 300 chars:', text.substring(0, 300));
        
        // Try alternative URL patterns
        console.log('HTML received, trying alternative URL patterns...');
        const altUrls = [
          // Coba dengan backend port yang berbeda (assume backend di 5000)
          `http://localhost:5000/${cleanPath}`,
          `http://localhost:5000/api/${cleanPath}`,
          // Coba prefix /api
          `${baseUrl}/api/${cleanPath}`,
          // Coba tanpa /uploads prefix
          `${baseUrl}/qrcodes/${imagePath.split('/').pop()}`,
          // Coba dengan /api/uploads
          `${baseUrl}/api/uploads/qrcodes/${imagePath.split('/').pop()}`,
        ];
        
        for (const altUrl of altUrls) {
          console.log('Trying alternative URL:', altUrl);
          try {
            const altResponse = await fetch(altUrl);
            if (altResponse.ok) {
              const altBlob = await altResponse.blob();
              if (altBlob.type.startsWith('image/')) {
                console.log('✓ Success with alternative URL:', altUrl);
                const imageUrl = URL.createObjectURL(altBlob);
                setQrImageBase64(imageUrl);
                setQrImageError(false);
                return;
              } else {
                console.log('  Non-image blob type:', altBlob.type);
              }
            } else {
              console.log('  Response not ok:', altResponse.status);
            }
          } catch (altError) {
            console.log('Alternative URL failed:', altError.message);
          }
        }
        
        setQrImageError(true);
        return;
      }
      
      const imageUrl = URL.createObjectURL(blob);
      console.log('Image blob URL created:', imageUrl);
      setQrImageBase64(imageUrl);
      setQrImageError(false);
    } catch (error) {
      console.error('Error fetching QR image:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      setQrImageError(true);
    }
  };

  const fetchResolvedQrImage = async (imagePath) => {
    try {
      const candidateUrls = getQrImageCandidates(imagePath);

      console.log('=== QR Image Fetch Debug Info ===');
      console.log('Candidate URLs:', candidateUrls);
      console.log('Image path (original):', imagePath);
      console.log('Resolved API URL:', getNormalizedApiUrl());
      console.log('REACT_APP_API_URL env:', process.env.REACT_APP_API_URL || '(not set)');
      console.log('window.location.origin:', window.location.origin);
      console.log('Current environment:', process.env.NODE_ENV);
      console.log('================================');

      if (!candidateUrls.length) {
        console.error('All QR image URL candidates failed for path:', imagePath);
        setQrImageError(true);
        return;
      }

      setQrImageCandidates(candidateUrls);
      setQrImageCandidateIndex(0);
      setQrImageUrl(candidateUrls[0]);
      setQrImageError(false);
    } catch (error) {
      console.error('Error fetching QR image:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      setQrImageError(true);
    }
  };

  const closeQrModalWithConfirm = () => {
    setShowCancelConfirm(true);
  };

  const handleCancelDonation = async () => {
    if (!createdCheckout?.transactions?.length) return;

    try {
      for (const transaksi of createdCheckout.transactions) {
        const transactionId = transaksi.id || transaksi.kode_transaksi;
        const detailTransaksiId = transaksi.detail_transaksi_id;

        if (!transactionId) {
          continue;
        }

        if (detailTransaksiId) {
          await deleteDetailTransaksi(detailTransaksiId);
        }

        const success = await deleteTransaksi(transactionId);
        if (!success) {
          alert('Gagal membatalkan donasi. ' + (errorDelete || 'Silakan hubungi admin.'));
          return;
        }
      }

      setShowCancelConfirm(false);
      setShowQrModal(false);
      setQrImageError(false);
      setQrImageBase64(null);
      setQrImageUrl('');
      setQrImageCandidates([]);
      setQrImageCandidateIndex(0);
      setCreatedCheckout(null);
      setSubmitMessage('Semua item donasi pada checkout ini telah dibatalkan.');
      resetForm();
    } catch (error) {
      console.error('Error canceling donation:', error);
      alert('Terjadi kesalahan saat membatalkan donasi: ' + error.message);
    }
  };

  const closeQrModal = async () => {
    if (!createdCheckout?.transactions?.length) {
      setShowQrModal(false);
      return;
    }

    for (const transaksi of createdCheckout.transactions) {
      const transactionId = transaksi.id || transaksi.id_transaksi;
      if (!transactionId) {
        alert('ID transaksi tidak ditemukan. Silakan cek riwayat transaksi Anda.');
        return;
      }

      const updateResponse = await putTransaksi(
        transactionId,
        transaksi.kode_transaksi,
        transaksi.kode_donatur,
        transaksi.kode_jenis_donasi,
        transaksi.kode_detail_donasi,
        transaksi.kode_user,
        transaksi.kode_himpun,
        transaksi.kode_detail_transaksi,
        transaksi.jumlah_donasi,
        'diproses',
        transaksi.catatan
      );

      if (!updateResponse) {
        alert('Status pembayaran belum berhasil dikonfirmasi. Silakan coba lagi.');
        return;
      }
    }

    setCreatedCheckout((prev) => (
      prev
        ? {
            ...prev,
            status: 'diproses',
            transactions: prev.transactions.map((item) => ({
              ...item,
              status: 'diproses',
              status_transaksi: 'diproses',
            })),
          }
        : prev
    ));
    setShowQrModal(false);
    setQrImageError(false);
    setQrImageBase64(null);
    setQrImageUrl('');
    setQrImageCandidates([]);
    setQrImageCandidateIndex(0);
    setSubmitMessage('Pembayaran Anda sedang diverifikasi. Status transaksi berubah menjadi diproses.');
    addNotification({
      title: 'Pembayaran QRIS Dikonfirmasi',
      message: 'Pembayaran Anda sedang kami verifikasi. Silakan cek riwayat transaksi untuk status terbaru.',
      userType: 'donatur',
      ...(createdCheckout?.kode_donatur ? { audienceKey: createdCheckout.kode_donatur } : {}),
    });
    addNotification({
      title: 'Konfirmasi Pembayaran dari Donatur',
      message: `Donatur telah mengkonfirmasi pembayaran untuk ${createdCheckout.transactions.length} transaksi dengan total ${formatCurrency(createdCheckout.total_donasi)}. Silakan cek dan verifikasi transaksi tersebut.`,
      userType: 'admin',
    });
    resetAfterSuccess();
  };

  const handleSelectPaymentMethod = (methodCode) => {
    const foundMethod = paymentMethodsWithDetails.find((item) => item.code === methodCode) || null;

    if (!foundMethod) return;

    setSelectedHimpunCode(methodCode);
    setMetodePembayaran(foundMethod.label);

    if (normalizeDonationLabel(foundMethod.label) === 'qris' || !foundMethod.details.length) {
      setSelectedPaymentDetailCode('');
      setExpandedPaymentMethodCode('');
      setIsPaymentDropdownOpen(false);
      return;
    }

    setSelectedPaymentDetailCode('');
    setExpandedPaymentMethodCode((prev) => (prev === methodCode ? '' : methodCode));
  };

  const handleSelectPaymentDetail = (methodCode, detailCode) => {
    const foundMethod = paymentMethodsWithDetails.find((item) => item.code === methodCode) || null;
    const foundDetail = foundMethod?.details.find((item) => getDetailHimpunCode(item) === detailCode) || null;

    if (!foundMethod || !foundDetail) return;

    setSelectedHimpunCode(methodCode);
    setMetodePembayaran(foundMethod.label);
    setSelectedPaymentDetailCode(detailCode);
    setExpandedPaymentMethodCode(methodCode);
    setIsPaymentDropdownOpen(false);
  };

  const handleJenisChange = (e) => {
    const value = e.target.value;
    const foundJenis = jenisDonasiList.find((item) => {
      const itemKode = item.kode_jenis_donasi || item.kode || item.kode_jenis;
      return String(itemKode) === value;
    });

    setSelectedJenis(foundJenis || null);
    setSelectedDetail(null);
  };

  const handleDetailChange = (e) => {
    const value = e.target.value;
    const foundDetail = filteredDetailByJenis.find((item) => {
      return getDetailIdentity(item) === value;
    });

    setSelectedDetail(foundDetail || null);
  };

  // eslint-disable-next-line no-unused-vars
  const handleAddDonationItem = () => {
    setSubmitMessage('');

    // **FITUR BARU: Batasi hanya satu transaksi per session**
    if (donationItems.length > 0) {
      setSubmitMessage('❌ Sistem hanya memungkinkan satu transaksi per session. Silakan selesaikan transaksi ini terlebih dahulu sebelum membuat donasi baru.');
      return;
    }

    if (!selectedJenis) {
      setSubmitMessage('Silakan pilih kategori donasi terlebih dahulu.');
      return;
    }

    if (!selectedDetail) {
      setSubmitMessage('Silakan pilih program donasi terlebih dahulu.');
      return;
    }

    if (!nominal || Number(nominal) <= 0) {
      setSubmitMessage('Silakan isi nominal donasi yang valid untuk item ini.');
      return;
    }

    const kodeJenis =
      selectedJenis.kode_jenis_donasi ||
      selectedJenis.kode ||
      selectedJenis.kode_jenis ||
      '';
    const kodeDetail =
      selectedDetail.kode_detail_donasi ||
      selectedDetail.kode ||
      selectedDetail.kode_detail ||
      '';

    const alreadyExists = donationItems.some(
      (item) =>
        String(item.kode_jenis_donasi) === String(kodeJenis) &&
        String(item.detail_identity) === getDetailIdentity(selectedDetail)
    );

    if (alreadyExists) {
      setSubmitMessage('Program donasi ini sudah ada di daftar. Silakan ubah nominal atau pilih program lain.');
      return;
    }

    setDonationItems((prev) => [
      ...prev,
      {
        id: `ITEM-${Date.now()}-${prev.length + 1}`,
        detail_identity: getDetailIdentity(selectedDetail),
        kode_jenis_donasi: kodeJenis,
        kode_detail_donasi: kodeDetail,
        namaJenis:
          selectedJenis.nama_donasi ||
          selectedJenis.nama ||
          selectedJenis.nama_jenis ||
          'Kategori Donasi',
        namaDetail:
          selectedDetail.nama_detail_donasi ||
          selectedDetail.nama ||
          'Program Donasi',
        nominal: Number(nominal),
      },
    ]);

    setNominal('');
    setSelectedJenis(initialSelectedJenis);
    setSelectedDetail(initialSelectedDetail);
    setSubmitMessage('✓ Item donasi ditambahkan. Anda dapat langsung memproses pembayaran.');
  };

  const getCurrentDraftDonationItem = () => {
    if (!selectedJenis || !selectedDetail || !nominal || Number(nominal) <= 0) {
      return null;
    }

    const kodeJenis =
      selectedJenis.kode_jenis_donasi ||
      selectedJenis.kode ||
      selectedJenis.kode_jenis ||
      '';
    const kodeDetail =
      selectedDetail.kode_detail_donasi ||
      selectedDetail.kode ||
      selectedDetail.kode_detail ||
      '';

    return {
      id: `DIRECT-${Date.now()}`,
      detail_identity: getDetailIdentity(selectedDetail),
      kode_jenis_donasi: kodeJenis,
      kode_detail_donasi: kodeDetail,
      namaJenis:
        selectedJenis.nama_donasi ||
        selectedJenis.nama ||
        selectedJenis.nama_jenis ||
        'Kategori Donasi',
      namaDetail:
        selectedDetail.nama_detail_donasi ||
        selectedDetail.nama ||
        'Program Donasi',
      nominal: Number(nominal),
    };
  };

  // eslint-disable-next-line no-unused-vars
  const handleRemoveDonationItem = (itemId) => {
    setDonationItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const ensureGuestDonaturRecord = async (normalizedGuestIdentity, existingKodeDonatur, currentUser) => {
    if (!isGuest) {
      return {
        kodeDonatur: existingKodeDonatur,
        guestUser: currentUser,
      };
    }

    if (existingKodeDonatur && String(existingKodeDonatur).trim()) {
      return {
        kodeDonatur: existingKodeDonatur,
        guestUser: currentUser,
      };
    }

    const createdGuestDonatur = await postDonatur(
      '',
      normalizedGuestIdentity.nama,
      '',
      '',
      '',
      normalizedGuestIdentity.jenis_kelamin,
      '',
      '',
      '',
      '',
      normalizedGuestIdentity.no_hp,
      normalizedGuestIdentity.email,
      '',
      0
    );

    if (!createdGuestDonatur) {
      throw new Error('Gagal membuat data donatur tamu. Silakan periksa koneksi internet dan coba lagi.');
    }

    const guestDonaturEntity = createdGuestDonatur?.donatur || createdGuestDonatur;

    if (!guestDonaturEntity || typeof guestDonaturEntity !== 'object') {
      throw new Error('Response data donatur tamu tidak valid. Hubungi admin jika masalah berlanjut.');
    }

    const kodeDonatur =
      guestDonaturEntity?.kode_donatur ||
      guestDonaturEntity?.kode ||
      '';

    if (!kodeDonatur || kodeDonatur.trim() === '') {
      console.error('Guest donatur entity structure:', guestDonaturEntity);
      throw new Error('Kode donatur tamu tidak ditemukan. Backend mungkin belum membuat kode donatur. Silakan coba beberapa saat lagi.');
    }

    const guestUser = {
      ...(currentUser?.isGuest ? currentUser : {}),
      nama: normalizedGuestIdentity.nama,
      email: normalizedGuestIdentity.email,
      no_hp: normalizedGuestIdentity.no_hp,
      jenis_kelamin: normalizedGuestIdentity.jenis_kelamin,
      isGuest: true,
      isRegister: 0,
      is_register: 0,
    };

    localStorage.setItem('guest_user', JSON.stringify(guestUser));

    return {
      kodeDonatur,
      guestUser,
    };
  };

  const validateGuestIdentity = (identity) => {
    if (!identity) return 'Identitas guest belum tersedia.';

    if (!identity.nama || !identity.jenis_kelamin || !identity.no_hp || !identity.email) {
      return 'Nama, jenis kelamin, nomor HP, dan email guest wajib diisi.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identity.email)) {
      return 'Format email guest tidak valid.';
    }

    const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(identity.no_hp.replace(/\s/g, ''))) {
      return 'Format nomor HP guest tidak valid. Gunakan +62xxx atau 0xxx.';
    }

    return '';
  };

  const findRegisteredDonaturCode = (currentUser) => {
    const directKodeDonatur =
      currentUser?.donatur?.kode_donatur ||
      currentUser?.kode_donatur ||
      currentUser?.kode ||
      '';

    if (directKodeDonatur) {
      return directKodeDonatur;
    }

    const normalizedEmail = String(currentUser?.donatur?.email || currentUser?.email || '')
      .trim()
      .toLowerCase();
    const normalizedPhone = String(
      currentUser?.donatur?.no_hp ||
      currentUser?.no_hp ||
      currentUser?.donatur?.nomor_hp ||
      ''
    ).replace(/\s/g, '');

    const matchedDonatur = donaturList.find((item) => {
      const itemEmail = String(item?.email || '').trim().toLowerCase();
      const itemPhone = String(item?.no_hp || item?.nomor_hp || item?.phone || '').replace(/\s/g, '');

      return (
        (normalizedEmail && itemEmail === normalizedEmail) ||
        (normalizedPhone && itemPhone === normalizedPhone)
      );
    });

    return matchedDonatur?.kode_donatur || matchedDonatur?.kode || '';
  };

  const handleCreateDetailTransaksi = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    const normalizedGuestIdentity = isGuest
      ? {
          nama: String(guestIdentity.nama || user?.donatur?.nama || user?.nama || '').trim(),
          jenis_kelamin: String(guestIdentity.jenis_kelamin || user?.donatur?.jenis_kelamin || user?.jenis_kelamin || '').trim(),
          no_hp: String(guestIdentity.no_hp || user?.donatur?.no_hp || user?.no_hp || '').trim(),
          email: String(guestIdentity.email || user?.donatur?.email || user?.email || '').trim(),
        }
      : null;

    if (!metodePembayaran) {
      setSubmitMessage('Silakan pilih metode/jalur pembayaran.');
      return;
    }

    if (!isQrisMethod && !selectedPaymentDetail) {
      setSubmitMessage('Silakan pilih detail pembayaran terlebih dahulu.');
      return;
    }

    const effectiveDonationItems = donationItems.length
      ? donationItems
      : (() => {
          const draftItem = getCurrentDraftDonationItem();
          return draftItem ? [draftItem] : [];
        })();

    if (!effectiveDonationItems.length) {
      setSubmitMessage('Pilih kategori, program, dan nominal donasi terlebih dahulu.');
      return;
    }

    // **FITUR BARU: Validasi hanya boleh 1 transaksi per submit**
    if (effectiveDonationItems.length > 1) {
      setSubmitMessage('❌ Sistem hanya memungkinkan satu donasi per transaksi. Silakan hapus item tambahan dan coba lagi.');
      return;
    }

    try {
      const kodeHimpun =
        getHimpunCode(selectedHimpun) ||
        selectedHimpunCode ||
        '';
      const jalurPembayaran = getHimpunName(selectedHimpun) || metodePembayaran;
      const namaMetodePembayaran = isQrisMethod
        ? jalurPembayaran
        : getDetailHimpunName(selectedPaymentDetail);
      const kodeDetailTransaksi = isQrisMethod
        ? ''
        : getDetailHimpunCode(selectedPaymentDetail);

      let kodeDonatur = findRegisteredDonaturCode(user);
      let effectiveUser = user;

      const isRegisterFlag =
        user?.donatur?.isRegister ??
        user?.donatur?.is_register ??
        user?.isRegister ??
        user?.is_register ??
        (isGuest ? 0 : 1);

      const finalCatatanDonatur = String(catatanDonatur || '').trim();
      const kodeUser = '';

      if (isGuest) {
        const guestValidationError = validateGuestIdentity(normalizedGuestIdentity);
        if (guestValidationError) {
          setSubmitMessage(guestValidationError);
          return;
        }

        const guestDonaturResult = await ensureGuestDonaturRecord(
          normalizedGuestIdentity,
          kodeDonatur,
          user
        );

        kodeDonatur = guestDonaturResult?.kodeDonatur || '';
        effectiveUser = guestDonaturResult?.guestUser || user;

        if (!kodeDonatur || !String(kodeDonatur).trim()) {
          throw new Error('Data donatur guest belum berhasil dibuat, jadi transaksi tidak dapat dilanjutkan.');
        }
      }

      if (!kodeDonatur) {
        throw new Error('Kode donatur tidak ditemukan. Silakan login ulang atau lengkapi identitas guest terlebih dahulu.');
      }

      const createdTransactions = [];

      // **FITUR BARU: Restrict ke hanya 1 transaksi per session**
      const itemsToProcess = effectiveDonationItems.slice(0, 1); // Ambil maksimal 1 item pertama

      for (const item of itemsToProcess) {
        const kodeTransaksi = `TRX-${Date.now()}-${createdTransactions.length + 1}`;

        const transaksiResponse = await postTransaksi(
          kodeTransaksi,
          kodeDonatur,
          item.kode_jenis_donasi,
          item.kode_detail_donasi,
          kodeUser,
          kodeHimpun,
          kodeDetailTransaksi,
          item.nominal,
          'pending',
          finalCatatanDonatur,
          isRegisterFlag,
          namaMetodePembayaran,
          jalurPembayaran
        );

        const transaksiData = transaksiResponse.transaksi || transaksiResponse;
        createdTransactions.push({
          ...transaksiData,
          detail_transaksi_id: null,
          kode_detail_transaksi: transaksiData.kode_detail_transaksi || kodeDetailTransaksi,
          metode_pembayaran:
            transaksiData.metode_pembayaran ||
            transaksiData.metode ||
            transaksiData.jalur_pembayaran ||
            transaksiData.nama_detail_transaksi ||
            namaMetodePembayaran,
          jalur_pembayaran:
            transaksiData.jalur_pembayaran ||
            jalurPembayaran,
          nama_detail_transaksi:
            transaksiData.nama_detail_transaksi ||
            transaksiData.metode_pembayaran ||
            transaksiData.metode ||
            transaksiData.jalur_pembayaran ||
            namaMetodePembayaran,
          nama_jenis_donasi: item.namaJenis,
          nama_detail_donasi: item.namaDetail,
          jumlah_donasi: Number(item.nominal || 0),
        });
      }

      if (createdTransactions.length) {

        const checkoutSummary = {
          transactions: createdTransactions,
          total_donasi: createdTransactions.reduce(
            (total, item) => total + Number(item.jumlah_donasi || 0),
            0
          ),
          total_item: createdTransactions.length,
          metode_pembayaran: namaMetodePembayaran,
          jalur_pembayaran: jalurPembayaran,
          status: 'pending',
          kode_donatur: kodeDonatur,
        };

        setCreatedCheckout(checkoutSummary);
        addNotification({
          title: 'Donasi Baru Masuk',
          message: `Ada ${createdTransactions.length} transaksi donasi baru dari ${isGuest ? normalizedGuestIdentity.nama : effectiveUser?.donatur?.nama || effectiveUser?.nama || 'donatur'} dengan total ${formatCurrency(checkoutSummary.total_donasi)}.`,
          userType: 'admin',
        });

        if (isQrisMethod) {
            console.log('=== QR Code Data (from /api/qrcode/active) ===');
            console.log('qrCodeData:', qrCodeData);
            console.log('qrCodeData JSON:', JSON.stringify(qrCodeData, null, 2));
            console.log('qrCodeData type:', typeof qrCodeData);
            console.log('Is Array:', Array.isArray(qrCodeData));
            
            let qrCode = null;
            
            // Cek apakah qrCodeData langsung object dengan image property (direct response dari /active)
            if (qrCodeData && typeof qrCodeData === 'object' && !Array.isArray(qrCodeData) && (qrCodeData.image_qrcode || qrCodeData.image_url || qrCodeData.image || qrCodeData.url || qrCodeData.qr_image)) {
              qrCode = qrCodeData;
              console.log('✓ Direct object with image property');
            } 
            // Cek jika ada wrapper property 'data' yang berisi object
            else if (qrCodeData?.data && typeof qrCodeData.data === 'object' && (qrCodeData.data.image_qrcode || qrCodeData.data.image_url || qrCodeData.data.image || qrCodeData.data.url || qrCodeData.data.qr_image)) {
              qrCode = qrCodeData.data;
              console.log('✓ Found in qrCodeData.data');
            }
            // Handle jika qrCodeData adalah object dengan property yang berisi array atau object
            if (qrCodeData && typeof qrCodeData === 'object' && !Array.isArray(qrCodeData)) {
              console.log('Handling as object with properties');
              console.log('Object keys:', Object.keys(qrCodeData));
              
              // Cari first valid QR code dari map/object properties
              for (const key in qrCodeData) {
                let item = qrCodeData[key];
                console.log(`Checking property "${key}":`, item);
                
                // Jika property adalah array, ambil element pertama
                if (Array.isArray(item)) {
                  console.log(`  → "${key}" is array, taking first element`);
                  item = item[0];
                }
                
                // Check untuk berbagai property name
                if (item && typeof item === 'object' && (item.image_qrcode || item.image_url || item.image || item.url || item.qr_image)) {
                  qrCode = item;
                  console.log(`✓ Found QR code at key "${key}"`);
                  break;
                }
              }
            } 
            // Fallback untuk array structure
            else if (Array.isArray(qrCodeData?.qrcode)) {
              qrCode = qrCodeData.qrcode[0];
              console.log('✓ Found in qrCodeData.qrcode[0]');
            } else if (Array.isArray(qrCodeData)) {
              qrCode = qrCodeData[0];
              console.log('✓ Found as direct array [0]');
            } else if (Array.isArray(qrCodeData?.data)) {
              qrCode = qrCodeData.data[0];
              console.log('✓ Found in qrCodeData.data[0]');
            }
            
            console.log('Final QR Code selected:', qrCode);
            console.log('=============================================');
            
            if (qrCode) {
              console.log('✓ QR Code found');
              console.log('QR Code Full Data:', qrCode);
              console.log('QR Code Keys:', Object.keys(qrCode));
              
              // Cek berbagai property name untuk image path
              const imagePath = qrCode.image_qrcode || qrCode.image_url || qrCode.image || qrCode.url || qrCode.qr_image;
              console.log('Image properties available:', {
                image_qrcode: qrCode.image_qrcode,
                image_url: qrCode.image_url,
                image: qrCode.image,
                url: qrCode.url,
                qr_image: qrCode.qr_image,
              });
              console.log('Image path used:', imagePath);
              
              if (imagePath) {
                console.log('✓ Setting QR Modal for QRIS payment');
                setSelectedQrCode(qrCode);
                setQrImageError(false);
                setQrImageBase64(null);
                setQrImageUrl('');
                setQrImageCandidates([]);
                setQrImageCandidateIndex(0);
                // Fetch image (non-blocking - modal will show with placeholder if fetch fails)
                console.log('Attempting to fetch QR image with path:', imagePath);
                fetchResolvedQrImage(imagePath);
                setShowQrModal(true);
              } else {
                console.warn('QR Code found but no image property found');
                console.log('Available properties:', qrCode);
                setSubmitMessage('QR Code ada tapi tidak ada path gambar. Silakan hubungi admin.');
              }
            } else {
              console.warn('No valid QR code found');
              console.log('qrCodeData structure:', qrCodeData);
              setSubmitMessage('QR Code tidak tersedia. Silakan gunakan metode pembayaran lain.');
            }
          } else {
            setSubmitMessage('Semua transaksi donasi berhasil dibuat. Terima kasih atas donasi Anda.');
            addNotification({
              title: 'Transaksi Donasi Berhasil',
              message: 'Donasi Anda telah berhasil dibuat dan sedang menunggu konfirmasi admin.',
              userType: 'donatur',
              audienceKey: kodeDonatur,
            });
            resetAfterSuccess();
          }
      }
    } catch (err) {
      console.error('Error creating donation checkout:', err);
      setSubmitMessage(err.message || 'Terjadi kesalahan saat membuat detail transaksi.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-slate-200/50 w-full max-w-md text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Menyiapkan data transaksi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-slate-100">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-red-200/50 w-full max-w-md text-center">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-600 text-sm">Terjadi kesalahan saat memuat data. Silakan coba lagi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 py-10 px-6 lg:px-16">
      <div className="w-full space-y-8">

       
        {/* Form Pembayaran */}
        {!createdCheckout && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Detail Pembayaran</h2>
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleCreateDetailTransaksi}
          >
            {isGuest && (
              <div className="md:col-span-2 rounded-3xl border border-amber-200 bg-amber-50 p-5">
                <div className="mb-4">
                  <p className="text-sm font-bold text-slate-900">Identitas Tamu</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Karena Anda berdonasi sebagai tamu, lengkapi identitas singkat berikut sebelum melanjutkan donasi.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-800">Nama</label>
                    <input
                      type="text"
                      name="nama"
                      value={guestIdentity.nama}
                      onChange={handleGuestIdentityChange}
                      placeholder="Masukkan nama lengkap"
                      className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-800">Jenis Kelamin</label>
                    <select
                      name="jenis_kelamin"
                      value={guestIdentity.jenis_kelamin}
                      onChange={handleGuestIdentityChange}
                      className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-800">Nomor HP</label>
                    <input
                      type="tel"
                      name="no_hp"
                      value={guestIdentity.no_hp}
                      onChange={handleGuestIdentityChange}
                      placeholder="Contoh: 08123456789"
                      className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-800">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={guestIdentity.email}
                      onChange={handleGuestIdentityChange}
                      placeholder="Masukkan email aktif"
                      className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <svg className="w-4 h-4 text-blue-600 bg-blue-100 p-1 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Kategori Donasi
              </label>
              <select
                value={selectedJenis ? (selectedJenis.kode_jenis_donasi || selectedJenis.kode || selectedJenis.kode_jenis || '') : ''}
                onChange={handleJenisChange}
                disabled={Boolean(forcedJenisKey)}
                className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 transition-all duration-200 font-semibold"
              >
                <option value="">Pilih kategori donasi</option>
                {jenisDonasiList.map((item) => (
                  <option
                    key={item.id || item.id_jenis_donasi || item.kode_jenis_donasi || item.kode}
                    value={item.kode_jenis_donasi || item.kode || item.kode_jenis || ''}
                  >
                    {item.nama_donasi || item.nama || item.nama_jenis}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 font-medium">
                {forcedJenisKey
                  ? 'Kategori mengikuti menu donasi yang sedang Anda buka.'
                  : 'Pilih salah satu kategori: zakat, infaq, wakaf, atau kategori lain yang tersedia.'}
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <svg className="w-4 h-4 text-blue-600 bg-blue-100 p-1 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2z" />
                </svg>
                Program Donasi
              </label>
              <select
                value={selectedDetail ? getDetailIdentity(selectedDetail) : ''}
                onChange={handleDetailChange}
                disabled={!selectedJenis}
                className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 transition-all duration-200 font-semibold disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">{selectedJenis ? 'Pilih program donasi' : 'Pilih kategori terlebih dahulu'}</option>
                {filteredDetailByJenis.map((detail) => (
                  <option
                    key={getDetailIdentity(detail)}
                    value={getDetailIdentity(detail)}
                  >
                    {detail.nama_detail_donasi || detail.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Nominal */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <svg className="w-4 h-4 text-blue-600 bg-blue-100 p-1 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Nominal Donasi
              </label>
              <input
                type="number"
                min="0"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="Rp 0"
                className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 transition-all duration-200 font-semibold"
              />
              <p className="text-xs text-slate-500 font-medium">Isi nominal untuk item donasi yang sedang Anda pilih.</p>
              {nominal && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex justify-between text-xs text-slate-600 mb-2 font-semibold">
                    <span>Progress Donasi</span>
                    <span>{Math.min((Number(nominal) / 100000) * 100, 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 shadow-md"
                      style={{ width: `${Math.min((Number(nominal) / 100000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Metode */}
            <div className="space-y-3" ref={paymentDropdownRef}>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <svg className="w-4 h-4 text-blue-600 bg-blue-100 p-1 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Metode Pembayaran
              </label>
              <button
                type="button"
                onClick={() => setIsPaymentDropdownOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 transition-all duration-200 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <span className={selectedHimpunCode ? 'text-slate-800' : 'text-slate-400'}>
                  {paymentDropdownLabel}
                </span>
                <svg
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isPaymentDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isPaymentDropdownOpen && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  {paymentMethodsWithDetails.map((method) => {
                    const isExpanded = expandedPaymentMethodCode === method.code;
                    const isSelectedMethod = selectedHimpunCode === method.code;
                    const hasDetails = method.details.length > 0;
                    const methodIsQris = normalizeDonationLabel(method.label) === 'qris';

                    return (
                      <div key={method.code} className="border-b border-slate-100 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => handleSelectPaymentMethod(method.code)}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                            isSelectedMethod ? 'bg-blue-50 text-blue-900' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="font-semibold">{method.label}</span>
                          {hasDetails && !methodIsQris ? (
                            <svg
                              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">Pilih</span>
                          )}
                        </button>

                        {hasDetails && !methodIsQris && isExpanded && (
                          <div className="border-t border-slate-100 bg-slate-50 px-2 py-2">
                            {method.details.map((detail) => {
                              const detailCode = getDetailHimpunCode(detail);
                              const isSelectedDetail = selectedPaymentDetailCode === detailCode && selectedHimpunCode === method.code;

                              return (
                                <button
                                  key={detailCode}
                                  type="button"
                                  onClick={() => handleSelectPaymentDetail(method.code, detailCode)}
                                  className={`mb-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm last:mb-0 ${
                                    isSelectedDetail
                                      ? 'bg-blue-600 text-white'
                                      : 'text-slate-700 hover:bg-white'
                                  }`}
                                >
                                  {getDetailHimpunName(detail)}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <svg className="w-4 h-4 text-blue-600 bg-blue-100 p-1 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h8m-8 4h6M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
                Catatan Donasi
              </label>
              <textarea
                value={catatanDonatur}
                onChange={(e) => setCatatanDonatur(e.target.value)}
                rows="4"
                placeholder="Tulis catatan atau pesan singkat untuk donasi ini"
                className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 transition-all duration-200 resize-none"
              />
            </div>

            {/* Button */}
            <div className="md:col-span-2 pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={
                  loadingTransaksi ||
                  (!donationItems.length && !getCurrentDraftDonationItem())
                }
                className="w-full px-8 py-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] disabled:transform-none disabled:opacity-50 border border-blue-500 hover:border-blue-600"
              >
                {loadingTransaksi ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Memproses Pembayaran...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Proses Donasi Sekarang</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          {submitMessage && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
              {submitMessage}
            </div>
          )}
        </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Panduan Singkat</h2>
              <p className="text-sm text-slate-600">Petunjuk cara melakukan donasi (satu transaksi per session)</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-900">1. Pilih Kategori & Program Donasi</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Pilih jenis donasi (Zakat, Infak, dll), kemudian pilih program yang sesuai dengan kategori yang dipilih.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-900">2. Isi Nominal & Metode Pembayaran</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Masukkan jumlah yang ingin didonasikan, pilih metode pembayaran dari data himpun, 
                kemudian klik tombol <span className="font-semibold">Proses Donasi Sekarang</span>.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-900">3. Selesaikan Pembayaran</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Ikuti instruksi pembayaran sesuai metode yang dipilih. Status awal transaksi adalah `pending`. 
                Untuk QRIS, scan QR code dan konfirmasi pembayaran. Verifikasi biasanya selesai dalam 5-10 menit.
              </p>
            </div>
          </div>
        </div>

        {/* Success */}
        {createdCheckout && !showQrModal && (
          <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 border-2 border-green-300 rounded-3xl p-6 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">Pembayaran Berhasil! ✓</h3>
              <p className="text-slate-600 text-sm md:text-base">Terima kasih atas donasi Anda. Semoga menjadi berkah dan bermanfaat.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border-2 border-green-200 shadow-md">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 font-semibold">Jumlah Transaksi</p>
                <p className="font-bold text-slate-800 text-lg">{createdCheckout.total_item} Item</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border-2 border-green-200 shadow-md">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 font-semibold">Total Donasi</p>
                <p className="font-bold text-green-700 text-lg">{formatCurrency(createdCheckout.total_donasi)}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border-2 border-green-200 shadow-md">
                <p className="text-slate-500 text-xs uppercase tracking-widest mb-2 font-semibold">Status Pembayaran</p>
                <p className="font-bold text-blue-600 text-lg">{createdCheckout.status || "Pending Verifikasi"}</p>
              </div>
            </div>

            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-md">
              <p className="text-sm font-semibold text-slate-900">Ringkasan item donasi</p>
              <div className="mt-4 space-y-3">
                {createdCheckout.transactions.map((item, index) => (
                  <div
                    key={item.id || item.kode_transaksi || index}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {index + 1}. {item.nama_detail_donasi || item.kode_detail_donasi}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {item.nama_jenis_donasi || item.kode_jenis_donasi}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Kode transaksi: {item.kode_transaksi}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-blue-700">
                      {formatCurrency(item.jumlah_donasi)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {isQrisMethod && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-purple-900 mb-2">Informasi Pembayaran QRIS</p>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Pembayaran Anda sedang menunggu konfirmasi dari sistem kami
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verifikasi otomatis biasanya selesai dalam 5-10 menit
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Admin akan melakukan verifikasi tambahan jika diperlukan
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Informasi Status</p>
                  <p className="text-sm text-slate-700">Admin akan memverifikasi pembayaran Anda dalam waktu 1-2 jam kerja. Silakan cek riwayat transaksi untuk status terbaru.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => {
                  resetForm();
                  setCreatedCheckout(null);
                }}
                className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] disabled:transform-none disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Donasi Lagi
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-6 py-4 rounded-xl bg-white border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19H5a2 2 0 01-2-2V7a2 2 0 012-2h4m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-4 0h4" />
                </svg>
                Kembali
              </button>
            </div>
          </div>
        )}

        {/* QR Code Modal - Muncul setelah klik Proses Donasi dengan metode QRIS */}
        {showQrModal && selectedQrCode && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 md:p-8 flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Scan QR Code QRIS</h2>
                  <p className="text-purple-100 text-sm">Silakan scan untuk menyelesaikan pembayaran Anda</p>
                </div>
                <button
                  onClick={closeQrModalWithConfirm}
                  className="flex-shrink-0 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Instructions */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg mb-3">Instruksi Pembayaran:</h3>
                      <ol className="space-y-3">
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                          <div>
                            <p className="font-medium text-slate-800">Buka aplikasi e-wallet atau mobile banking</p>
                            <p className="text-sm text-slate-600">Gunakan aplikasi favorit Anda (GCash, GoPay, OVO, DANA, dll)</p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                          <div>
                            <p className="font-medium text-slate-800">Pilih menu Scan QR atau Pembayaran</p>
                            <p className="text-sm text-slate-600">Cari fitur untuk memindai kode QR</p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                          <div>
                            <p className="font-medium text-slate-800">Arahkan ke QR code di samping</p>
                            <p className="text-sm text-slate-600">Pastikan QR code terlihat dengan jelas di layar</p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                          <div>
                            <p className="font-medium text-slate-800">Konfirmasi pembayaran</p>
                            <p className="text-sm text-slate-600">Masukkan PIN atau otentikasi untuk menyelesaikan transaksi</p>
                          </div>
                        </li>
                      </ol>
                    </div>

                    {/* Supported Apps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-3">Aplikasi yang didukung:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          GCash
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          GoPay
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          OVO
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          DANA
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 shadow-lg">
                      {qrImageError ? (
                        <div className="w-56 h-56 flex flex-col items-center justify-center bg-slate-100 rounded-lg">
                          <svg className="w-16 h-16 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <p className="text-slate-600 text-sm text-center">QR Code tidak dapat dimuat</p>
                          <p className="text-xs text-slate-500 mt-2 text-center">Silakan hubungi admin</p>
                        </div>
                      ) : (qrImageBase64 || qrImageUrl) ? (
                        <img 
                          src={qrImageBase64 || qrImageUrl}
                          alt="QRIS QR Code" 
                          className="w-56 h-56 object-contain"
                          onError={handleQrDisplayError}
                        />
                      ) : (
                        <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-lg">
                          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 text-center font-medium">
                      QR Code QRIS Anda
                    </p>
                    {createdCheckout && (
                      <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Pembayaran</p>
                        <p className="mt-2 text-lg font-bold text-slate-900">
                          {formatCurrency(createdCheckout.total_donasi)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {createdCheckout.total_item} item donasi dalam checkout ini
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={downloadQrCode}
                      className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download QR Code
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
                  <button
                    onClick={closeQrModal}
                    disabled={loadingUpdateTransaksi}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    {loadingUpdateTransaksi ? (
                      'Memproses konfirmasi pembayaran...'
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Saya Sudah Melakukan Pembayaran
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-slate-500">
                    Pembayaran Anda akan diverifikasi dalam waktu 5-10 menit. Anda bisa menutup modal ini dan melihat status transaksi di riwayat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Batalkan Donasi?</h3>
              </div>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Apakah Anda yakin ingin membatalkan donasi ini? Data transaksi Anda akan dihapus dari sistem.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-bold shadow-sm hover:shadow-md transition-all duration-300 hover:bg-slate-50"
                >
                  Tidak, Lanjutkan
                </button>
                <button
                  type="button"
                  onClick={handleCancelDonation}
                  disabled={loadingDelete}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingDelete ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Membatalkan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Ya, Batalkan
                    </>
                  )}
                </button>
              </div>

              {errorDelete && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{errorDelete}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transaksi;
