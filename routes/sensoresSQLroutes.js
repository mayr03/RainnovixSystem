import express from 'express';
const  cors = require('cors');
import sql from 'mssql';
import dotenv from 'dotenv';
const {pool,conectarMongoDB}=require('../config/db')

import{dbSettings} from '../config/connection';
import { conectarMongoDB } from '../config/db';
import Sensor from '../models/sensores';

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());
conectarMongoDB();


//Configuracion de SQL Server
app.get('/', async(req,res)=>{
    try {
        const pool=await getConnection();
        const result = await pool.request().query('Select * from Sensores');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({error:'Error en la coneccion con Sensores en SQL', details:error.message});

    }
});

app.get('/:id', async(req,res)=>{
    const { id } = req.params;
  try {
    const pool = await getSqlConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Sensores WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Sensor no encontrado' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error en la coneccion del SQL Server', details: error.message });
  }
});

app.post('/', async (req, res) => {
    const { TipoSensor, Estado, Ubicacion, idCultivo_fk } = req.body;
    if (!TipoSensor || !Estado || !Ubicacion || !idCultivo_fk) {
      return res.status(400).json({ error: 'No se encuentran los campos' });
    }
  
    try {
      const pool = await getSqlConnection();
      await pool.request()
        .input('TipoSensor', sql.VarChar, TipoSensor)
        .input('Estado', sql.VarChar, Estado)
        .input('Ubicacion', sql.VarChar, Ubicacion)
        .input('idCultivo_fk', sql.VarChar, idCultivo_fk)
        .query(`INSERT INTO Sensores (TipoSensor, Estado, Ubicacion, idCultivo_fk)
                VALUES (@TipoSensor, @Estado, @Ubicacion, @idCultivo_fk)`);
      res.status(201).json({ message: 'Sensor fue creado en SQL Server' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el sensor SQL Server', details: error.message });
    }
});

app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { TipoSensor, Estado, Ubicacion, idCultivo_fk } = req.body;
    if (!TipoSensor || !Estado || !Ubicacion || !idCultivo_fk) {
      return res.status(400).json({ error: 'Perdida en los campos' });
    }
    try {
      const pool = await getSqlConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('TipoSensor', sql.VarChar, TipoSensor)
        .input('Estado', sql.VarChar, Estado)
        .input('Ubicacion', sql.VarChar, Ubicacion)
        .input('idCultivo_fk', sql.VarChar, idCultivo_fk)
        .query(`UPDATE Sensores
                SET TipoSensor = @TipoSensor,
                    Estado = @Estado,
                    Ubicacion = @Ubicacion,
                    idCultivo_fk = @idCultivo_fk
                WHERE id = @id`);
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'Sensor no localizado' });
      }
      res.json({ message: 'Sensor actualizado en SQL Server' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el sensor en SQL Server', details: error.message });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await getSqlConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Sensores WHERE id = @id');
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'Sensor no encontrado' });
      }
      res.json({ message: 'Sensor borrado con exito SQL Server' });
    } catch (error) {
      res.status(500).json({ error: 'Error al momento de borar el sensor en SQL Server', details: error.message });
    }
});

//Configuracion api Mongodb
app.get('/', async (req, res) => {
    try {
      const sensores = await Sensor.find();
      res.json(sensores);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener todos los sensores', details: error.message });
    }
});

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const sensor = await Sensor.findById(id);
      if (!sensor) {
        return res.status(404).json({ error: 'Sensor no encontrado' });
      }
      res.json(sensor);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el sensor por ID', details: error.message });
    }
});

app.post('/', async (req, res) => {
    const { TipoSensor, Estado, Ubicacion, idCultivo_fk } = req.body;
    if (!TipoSensor || !Estado || !Ubicacion || !idCultivo_fk) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
  
    try {
      const newSensor = new Sensor({ TipoSensor, Estado, Ubicacion, idCultivo_fk });
      await newSensor.save();
      res.status(201).json({ message: 'Sensor creado en MongoDB', sensor: newSensor });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el sensor en MongoDB', details: error.message });
    }
});

app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { TipoSensor, Estado, Ubicacion, idCultivo_fk } = req.body;
    if (!TipoSensor || !Estado || !Ubicacion || !idCultivo_fk) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
  
    try {
      const sensor = await Sensor.findByIdAndUpdate(id, { TipoSensor, Estado, Ubicacion, idCultivo_fk }, { new: true });
      if (!sensor) {
        return res.status(404).json({ error: 'Sensor no encontrado' });
      }
      res.json({ message: 'Sensor actualizado en MongoDB', sensor });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el sensor en MongoDB', details: error.message });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const sensor = await Sensor.findByIdAndDelete(id);
      if (!sensor) {
        return res.status(404).json({ error: 'Sensor no encontrado' });
      }
      res.json({ message: 'Sensor eliminado de MongoDB' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el sensor en MongoDB', details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});