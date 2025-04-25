import React, { useState } from 'react';

export const PopUp = ({ responseMsg, otp, setOtp, setResponseMsg, handleOtpSubmit }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Masukkan Kode OTP</h3>
                <p className="text-sm text-gray-600 mb-4">{responseMsg}</p>
                <form onSubmit={handleOtpSubmit}>
                    <div className="mb-4">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                        Kode OTP
                    </label>
                    <input
                        id="otp"
                        name="otp"
                        type="number"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                    />
                    </div>
                    <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={() => setResponseMsg('')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                        Verifikasi
                    </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export const ConfirmPopUp = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Konfirmasi</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

export const AlertPopUp = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pemberitahuan</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};