const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Get all todos
app.get('/todos', async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

// Add new todo
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  const todo = await prisma.todo.create({ data: { title } });
  res.json(todo);
});

// Update todo status
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const updated = await prisma.todo.update({
    where: { id: Number(id) },
    data: { completed },
  });
  res.json(updated);
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
