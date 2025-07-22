import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch items from the backend on component mount
  useEffect(() => {
    setIsLoading(true);
    fetch('/api/items')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch items');
        return res.json();
      })
      .then(data => {
        setItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  // Handle form submission to add a new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      setError('Item name cannot be empty');
      return;
    }
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName }),
      });
      if (!response.ok) throw new Error('Failed to add item');
      const newItem = await response.json();
      setItems([...items, newItem]);
      setNewItemName('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle deleting an item
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      setItems(items.filter(item => item.id !== id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Node.js + React Practice App
      </h1>

      {/* Error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form to add new item */}
      <form onSubmit={handleSubmit} className="mb-8 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter item name"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Item
          </button>
        </div>
      </form>

      {/* List of items */}
      {isLoading ? (
        <p className="text-gray-500">Loading items...</p>
      ) : (
        <ul className="w-full max-w-md">
          {items.length === 0 ? (
            <p className="text-gray-500">No items yet. Add some!</p>
          ) : (
            items.map(item => (
              <li
                key={item.id}
                className="p-4 bg-white border rounded-lg mb-2 shadow-sm flex justify-between items-center"
              >
                <span>{item.name}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;