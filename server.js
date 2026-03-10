require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');

const taskRoutes = require('./routes/task.routes');
const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middleware/auth.middleware');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: [
    'http://localhost:4200',           // développement
    'https://task-manager-api-4ufw.onrender.com/api'       // production (on mettra la vraie URL après)
  ] }));
app.use(express.json());

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées (nécessitent un token)
app.use('/api/tasks', authMiddleware, taskRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err.message);
  });