import { useState, useEffect } from 'react';
import './index.css';
import Notification from './Notification';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import EditItem from './EditItem';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

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
        setNotification({ message: err.message, type: 'error' });
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || newItemName.length < 2 || newItemName.length > 50) {
      setNotification({ message: 'Item name must be 2-50 characters.', type: 'error' });
      return;
    }
    setActionLoading(true);
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
      setNotification({ message: 'Item added successfully!', type: 'success' });
    } catch (err) {
      setNotification({ message: err.message, type: 'error' });
    }
    setActionLoading(false);
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }
      setItems(items.filter(item => item.id !== id));
      setNotification({ message: 'Item deleted successfully!', type: 'success' });
    } catch (err) {
      setNotification({ message: err.message, type: 'error' });
    }
    setActionLoading(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

  const handleUpdate = async (id) => {
    if (!editName.trim() || editName.length < 2 || editName.length > 50) {
      setNotification({ message: 'Item name must be 2-50 characters.', type: 'error' });
      return;
    }
    setActionLoading(true);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item');
      }
      const updatedItem = await response.json();
      setItems(items.map(item => (item.id === id ? updatedItem : item)));
      setEditingId(null);
      setEditName('');
      setNotification({ message: 'Item updated successfully!', type: 'success' });
    } catch (err) {
      setNotification({ message: err.message, type: 'error' });
    }
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">WORK LIST APP</h1>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: '' })}
      />
      <ItemForm
        value={newItemName}
        onChange={e => setNewItemName(e.target.value)}
        onSubmit={handleSubmit}
        loading={actionLoading}
      />
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="ml-2 text-gray-500">Loading items...</span>
        </div>
      ) : (
        <ItemList
          items={items}
          editingId={editingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          renderEdit={item => (
            <EditItem
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onSave={() => handleUpdate(item.id)}
              onCancel={() => setEditingId(null)}
              loading={actionLoading}
            />
          )}
        />
      )}
    </div>
  );
}

export default App;