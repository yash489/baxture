const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Dummy database
const users = [];

// Routes
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  // Check if userId is a valid UUID
  if (!uuid.validate(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
});

app.post('/api/users', (req, res) => {
  const { username, age, hobbies } = req.body;

  // Check if required fields are present
  if (!username || !age) {
    return res.status(400).json({ message: 'Username and age are required fields' });
  }

  const newUser = {
    id: uuid.v4(),
    username,
    age,
    hobbies: hobbies || [],
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

app.put('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  // Check if userId is a valid UUID
  if (!uuid.validate(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { username, age, hobbies } = req.body;

  // Check if required fields are present
  if (!username || !age) {
    return res.status(400).json({ message: 'Username and age are required fields' });
  }

  // Update the user
  users[userIndex] = {
    id: userId,
    username,
    age,
    hobbies: hobbies || [],
  };

  res.status(200).json(users[userIndex]);
});

app.delete('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  // Check if userId is a valid UUID
  if (!uuid.validate(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Remove the user
  users.splice(userIndex, 1);

  res.status(204).send();
});

// Handle non-existing endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});