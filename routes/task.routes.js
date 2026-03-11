const express = require('express');
const router  = express.Router();
const Task    = require('../models/task.model');

// GET — Récupérer uniquement les tâches de l'utilisateur connecté
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — Créer une tâche liée à l'utilisateur connecté
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      userId:      req.user.userId,
      title:       req.body.title,
      description: req.body.description,
      status:      req.body.status || 'todo',
      priority:    req.body.priority || 'medium',
      dueDate:     req.body.dueDate || null
    });
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT — Modifier uniquement si la tâche appartient à l'utilisateur
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        title:       req.body.title,
        description: req.body.description,
        status:      req.body.status,
        priority:    req.body.priority,
        dueDate:     req.body.dueDate
      },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE — Supprimer uniquement si la tâche appartient à l'utilisateur
router.delete('/:id', async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;