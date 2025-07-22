import React from 'react';

function EditItem({ value, onChange, onSave, onCancel, loading }) {
  return (
    <div className="flex gap-2 w-full" aria-label="Edit item">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="flex-1 p-2 border rounded-lg"
        aria-label="Edit item name"
        minLength={2}
        maxLength={50}
        required
      />
      <button
        onClick={onSave}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
        aria-disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
      <button
        onClick={onCancel}
        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        aria-label="Cancel edit"
      >
        Cancel
      </button>
    </div>
  );
}

export default EditItem;
