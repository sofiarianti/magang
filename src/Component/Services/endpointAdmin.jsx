// src/Services/endpoints.js
const endpointsAdmin = {
    users: {
      getAll: '/api/users',
      getById: (id) => `/api/users/getbyid/${id}`,
      create: '/api/users/insert',
      login: '/api/users/login',
      update: (id) => `/api/users/update/${id}`,
      delete: (id) => `/api/users/delete/${id}`,
    },

    himpun: {
        getAll: '/api/himpun',
        getById: (id) => `/api/himpun/get/${id}`,
        create: '/api/himpun/insert',
        login: '/api/himpun/login',
        update: (id) => `/api/himpun/update/${id}`,
        delete: (id) => `/api/himpun/delete/${id}`,
      },

    donatur: {
    getAll: '/api/donatur',
    getById: (id) => `/api/donatur/get/${id}`,
    create: '/api/donatur/insert',
    login: '/api/donatur/login',
    update: (id) => `/api/donatur/update/${id}`,
    delete: (id) => `/api/donatur/delete/${id}`,
  },

  transaksi: {
      getAll: '/api/transaksi',
      getById: (id) => `/api/transaksi/get/${id}`,
      getByDonatur: (idDonatur) =>
        `/api/transaksi/donatur/${idDonatur}`,
      getByKodeDonatur: (kd_donatur) =>
        `/api/transaksi/by-donatur/${kd_donatur}`,
      create: '/api/transaksi/insert',
      login: '/api/transaksi/login',
      update: (id) => `/api/transaksi/update/${id}`,
      delete: (id) => `/api/transaksi/delete/${id}`,
    },
     qrcode: {
       getAll: '/api/qrcode',
       getActive: '/api/qrcode/active',
      getById: (id) => `/api/qrcode/get/${id}`,
      create: '/api/qrcode/insert',
      update: (id) => `/api/qrcode/update/${id}`,
     delete: (id) => `/api/qrcode/delete/${id}`,
     

    },
    penyaluran_program: {
      getAll: '/api/penyaluran-program',
      getByProgram: (idProgram) => `/api/penyaluran-program/by-program/${idProgram}`,
      getById: (id) => `/api/penyaluran-program/get/${id}`,
      create: '/api/penyaluran-program/insert',
      update: (id) => `/api/penyaluran-program/update/${id}`,
      delete: (id) => `/api/penyaluran-program/delete/${id}`,
    },
    program: {
      getAll: '/api/program',
      getById: (id) => `/api/program/get/${id}`,
      create: '/api/program/insert',
      update: (id) => `/api/program/update/${id}`,
      delete: (id) => `/api/program/delete/${id}`,
    },
    
  };
  
  
  export default endpointsAdmin;
