import React from 'react';

function ItemList({ items, editingId, onEdit, onDelete, renderEdit }) {
  if (items.length === 0) {
    return <p className="text-gray-500">No items yet. Add some!</p>;
  }
  return (
    <div className="w-full max-w-md grid grid-cols-1 gap-4" aria-label="Item list">
      {items.map(item => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center hover:bg-gray-50"
        >
          {editingId === item.id ? (
            renderEdit(item)
          ) : (
            <>
              <span className="font-medium">{item.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  aria-label={`Edit ${item.name}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  aria-label={`Delete ${item.name}`}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ItemList;
