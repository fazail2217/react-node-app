import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item');
      }
      const newItem = await response.json();
      setItems([...items, newItem]);
      setNewItemName('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }
      setItems(items.filter(item => item.id !== id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Node.js + React Practice App</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-8 w-full max-w-md bg-white rounded-lg shadow-md p-6">
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
      {isLoading ? (
        <p className="text-gray-500">Loading items...</p>
      ) : (
        <div className="w-full max-w-md grid grid-cols-1 gap-4">
          {items.length === 0 ? (
            <p className="text-gray-500">No items yet. Add some!</p>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <span className="font-medium">{item.name}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;