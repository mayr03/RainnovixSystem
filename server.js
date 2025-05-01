const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const registerRoutes = require('./routes/registerRoutes');
const cultivoRoutes = require('./routes/cultivoRoutes');
const cultivoSQLRoutes = require('./routes/cultivoSQLroutes');
const campoSQLRoutes = require('./routes/campoSQLroutes');
const riegoSQLRoutes = require('./routes/riegoSQLroutes');
const sensoresRoutes = require('./routes/sensoresSQLRoutes');
const actuadoresRoutes = require('./routes/actuadoresSQLroutes');

// Configuración de base de datos
const { pool, conectarMongoDB } = require('./config/db');
conectarMongoDB(); // Conectar MongoDB si es necesario

// Configurar las rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/auth', registerRoutes);
app.use('/api/cultivo', cultivoRoutes);
app.use('/api/cultivosql', cultivoSQLRoutes);
app.use('/api/campo', campoSQLRoutes);
app.use('/api/riego', riegoSQLRoutes);
app.use('/api/sensores', sensoresRoutes);
app.use('/api/actuadores', actuadoresRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));