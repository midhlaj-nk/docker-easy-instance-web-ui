import Swal from 'sweetalert2';

/**
 * Show a success alert
 */
export const showSuccess = (message, title = 'Success') => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK',
  });
};

/**
 * Show an error alert
 */
export const showError = (message, title = 'Error') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonColor: '#d33',
    confirmButtonText: 'OK',
  });
};

/**
 * Show a warning alert
 */
export const showWarning = (message, title = 'Warning') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonColor: '#f0ad4e',
    confirmButtonText: 'OK',
  });
};

/**
 * Show an info alert
 */
export const showInfo = (message, title = 'Info') => {
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'OK',
  });
};

/**
 * Show a confirmation dialog
 */
export const showConfirm = (message, title = 'Confirm', confirmText = 'Yes', cancelText = 'No') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

/**
 * Show a confirmation dialog for delete actions
 */
export const showDeleteConfirm = (message, title = 'Delete Confirmation') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });
};

/**
 * Show a loading alert
 */
export const showLoading = (message = 'Loading...') => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

/**
 * Close the current alert
 */
export const closeAlert = () => {
  Swal.close();
};

