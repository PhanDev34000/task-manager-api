const express = require('express');
const router  = express.Router();
const Task    = require('../models/task.model');

// GET — Récupérer toutes les tâches
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — Créer une tâche
router.post('/', async (req, res) => {
  try {
    const task = new Task({
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

// PUT — Modifier une tâche
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title:       req.body.title,
        description: req.body.description,
        status:      req.body.status,
        priority:    req.body.priority,
        dueDate:     req.body.dueDate
      },
      { new: true }  // ← on revient à { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE — Supprimer une tâche
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;