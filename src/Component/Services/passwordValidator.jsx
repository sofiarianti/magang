/**
 * Validasi kekuatan password
 * Password harus memenuhi kriteria:
 * - Minimal 8 karakter
 * - Minimal 1 huruf besar (A-Z)
 * - Minimal 1 huruf kecil (a-z)
 * - Minimal 1 angka (0-9)
 * - Minimal 1 simbol (!@#$%^&*)
 */

export const validatePasswordStrength = (password) => {
  const errors = [];
  const requirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
  };

  // Check panjang
  if (password.length >= 8) {
    requirements.length = true;
  } else {
    errors.push('Minimal 8 karakter');
  }

  // Check huruf besar
  if (/[A-Z]/.test(password)) {
    requirements.uppercase = true;
  } else {
    errors.push('Minimal 1 huruf besar (A-Z)');
  }

  // Check huruf kecil
  if (/[a-z]/.test(password)) {
    requirements.lowercase = true;
  } else {
    errors.push('Minimal 1 huruf kecil (a-z)');
  }

  // Check angka
  if (/[0-9]/.test(password)) {
    requirements.number = true;
  } else {
    errors.push('Minimal 1 angka (0-9)');
  }

  // Check simbol
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    requirements.symbol = true;
  } else {
    errors.push('Minimal 1 simbol (!@#$%^&* dll)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    requirements,
  };
};

/**
 * Check apakah password baru sama dengan password lama
 */
export const isPasswordSame = (oldPassword, newPassword) => {
  return oldPassword === newPassword;
};

/**
 * Check apakah password dan konfirmasi match
 */
export const isPasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};
