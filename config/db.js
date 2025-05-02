const { Pool } = require('pg'); // Importamos Pool para PostgreSQL
const mongoose = require('mongoose'); // Importamos Mongoose para MongoDB
require('dotenv').config();

const Cultivo = require('../Models/Cultivo'); // ✅ Importamos el modelo de MongoDB

// 🟢 Configuración de PostgreSQL con Pool
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// 🔍 Verificar conexión a PostgreSQL con consulta de prueba
const conectarPostgreSQL = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS fecha_actual'); // ✅ Consulta de prueba
    console.log('✅ Conexión exitosa a PostgreSQL:', result.rows[0].fecha_actual);
    client.release();
  } catch (err) {
    console.error('❌ Error en la conexión a PostgreSQL:', err);
    setTimeout(conectarPostgreSQL, 5000); // Intentar reconectar tras 5 segundos
  }
};

// 🔍 Conexión a MongoDB con consulta de prueba
const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
    console.log('✅ Credenciales correctas');

    // 🔹 Consulta para verificar datos en MongoDB
    const cultivo = await Cultivo.findOne({ NombreCultivo: 'Maíz' });

    if (cultivo) {
      console.log('✅ Datos del cultivo encontrados:', cultivo);
    } else {
      console.log('⚠️ No se encontró el cultivo con el nombre "Maíz".');
    }

  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1); // Terminar el proceso si no se conecta
  }
};

// 🟢 Ejecutar conexión a PostgreSQL y MongoDB
conectarPostgreSQL();
conectarMongoDB();

// ✅ Exportación correcta
module.exports = { pool, conectarMongoDB };