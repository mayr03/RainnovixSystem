
const sql = require('mssql');
const { sqlPool } = require('../config/db');

module.exports = {
  // Listar todos
  getAllRiegos: async () => {
    const pool = await sqlPool;
    const result = await pool.request().query('SELECT * FROM Riego');
    return result.recordset;
  },

  // Obtener por ID
  getRiegoById: async (id) => {
    const pool = await sqlPool;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Riego WHERE IdRiego = @id');
    return result.recordset[0];
  },

  // Crear uno nuevo
  createRiego: async (data) => {
    const pool = await sqlPool;
    const cols = Object.keys(data).join(', ');
    const vals = Object.values(data);
    const params = vals.map((_, i) => `@p${i}`).join(', ');
    const req = pool.request();
    vals.forEach((v, i) => req.input(`p${i}`, v));
    // Usamos SCOPE_IDENTITY() para obtener el nuevo ID
    const { recordset } = await req.query(
      `INSERT INTO Riego (${cols}) VALUES (${params}); SELECT SCOPE_IDENTITY() AS IdRiego;`
    );
    return { IdRiego: recordset[0].IdRiego, ...data };
  },

  // Actualizar
  updateRiego: async (id, data) => {
    const pool = await sqlPool;
    const keys = Object.keys(data);
    const vals = Object.values(data);
    const setStmt = keys.map((k, i) => `${k}=@p${i}`).join(', ');
    const req = pool.request();
    vals.forEach((v, i) => req.input(`p${i}`, v));
    req.input('id', id);
    const { recordset } = await req.query(
      `UPDATE Riego SET ${setStmt} WHERE IdRiego = @id; SELECT * FROM Riego WHERE IdRiego = @id;`
    );
    return recordset[0];
  },

  // Eliminar
  deleteRiego: async (id) => {
    const pool = await sqlPool;
    const { rowsAffected } = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Riego WHERE IdRiego = @id');
    return rowsAffected;
  }
};
