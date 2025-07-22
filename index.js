const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const dataFile = 'data.json';

let items = loadItems();

function loadItems() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile);
      return JSON.parse(data);
    }
    return [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
  } catch (error) {
    console.error('Error loading items:', error);
    return [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
  }
}

function saveItems() {
  fs.writeFileSync(dataFile, JSON.stringify(items, null, 2));
}

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Node.js Express API!' });
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newItem = {
    id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
    name: req.body.name
  };
  items.push(newItem);
  saveItems();
  res.status(201).json(newItem);
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items.splice(itemIndex, 1);
  saveItems();
  res.json({ message: `Item ${id} deleted` });
});

app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  items[itemIndex].name = req.body.name;
  saveItems();
  res.json(items[itemIndex]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});