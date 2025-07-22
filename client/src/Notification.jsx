import React from 'react';

function Notification({ message, type, onClose }) {
  if (!message) return null;
  // Show delete success messages in red
  const isDeleteSuccess = message.toLowerCase().includes('deleted');
  const bgColor = type === 'error' || isDeleteSuccess ? 'bg-red-500' : 'bg-green-500';
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white ${bgColor}`}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 bg-white text-black px-2 py-1 rounded"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default Notification;
