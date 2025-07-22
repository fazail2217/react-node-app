import React from 'react';

function ItemForm({ value, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="mb-8 w-full max-w-md bg-white rounded-lg shadow-md p-6" aria-label="Add new item">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Enter item name"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Item name"
          minLength={2}
          maxLength={50}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}

export default ItemForm;
