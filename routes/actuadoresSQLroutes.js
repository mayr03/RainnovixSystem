import express from 'express';
const  cors = require('cors');
import sql from 'mssql';
import dotenv from 'dotenv';
const {pool,conectarMongoDB}=require('../config/db')

import{dbSettings} from '../config/connection';
import { conectarMongoDB } from '../config/db';
import Actuador from '../models/actuadores';

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());
conectarMongoDB();


//Configuracion de SQL Server
app.get('/', async(req,res)=>{
    try {
        const pool=await getConnection();
        const result = await pool.request().query('Select * from Actuadores');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({error:'Error en la coneccion con Actuadores en SQL', details:error.message});

    }
});

app.get('/:id', async(req,res)=>{
    const { id } = req.params;
  try {
    const pool = await getSqlConnection();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Actuadores WHERE id = @id');
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'El actuador no se encontro' });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error en la coneccion del SQL Server', details: error.message });
  }
});

app.post('/', async (req, res) => {
    const { TipoActuador, Ubicacion, idCultivo_fk } = req.body;
    if (!TipoActuador || !Ubicacion || !idCultivo_fk) {
      return res.status(400).json({ error: 'No se encuentran los campos' });
    }
  
    try {
      const pool = await getSqlConnection();
      await pool.request()
        .input('TipoActuador', sql.VarChar, TipoActuador)
        .input('Ubicacion', sql.VarChar, Ubicacion)
        .input('idCultivo_fk', sql.VarChar, idCultivo_fk)
        .query(`INSERT INTO Sensores (TipoActuador, Ubicacion, idCultivo_fk)
                VALUES (@TipoActuador, @Ubicacion, @idCultivo_fk)`);
      res.status(201).json({ message: 'El actuador fue creado en SQL Server' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el actuador SQL Server', details: error.message });
    }
});

app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { TipoActuador, Ubicacion, idCultivo_fk } = req.body;
    if (!TipoActuador || !Ubicacion || !idCultivo_fk) {
      return res.status(400).json({ error: 'Perdida en los campos' });
    }
    try {
      const pool = await getSqlConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('TipoActuador', sql.VarChar, TipoActuador)
        .input('Ubicacion', sql.VarChar, Ubicacion)
        .input('idCultivo_fk', sql.VarChar, idCultivo_fk)
        .query(`UPDATE Actuadores
                SET TipoActuador = @TipoActuador,
                    Ubicacion = @Ubicacion,
                    idCultivo_fk = @idCultivo_fk
                WHERE id = @id`);
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'El Actuador no fue localizado' });
      }
      res.json({ message: 'El actuador fue actualizado en SQL Server' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el actuador en SQL Server', details: error.message });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await getSqlConnection();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Actuadores WHERE id = @id');
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'Actuador no encontrado' });
      }
      res.json({ message: 'Actuador borrado con exito SQL Server' });
    } catch (error) {
      res.status(500).json({ error: 'Error al momento de borar el actuador en SQL Server', details: error.message });
    }
});

//Configuracion api Mongodb
app.get('/', async (req, res) => {
    try {
      const actuadores = await Actuador.find();
      res.json(actuadores);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener todos los actuadores', details: error.message });
    }
});

app.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const actuador = await Actuador.findById(id);
      if (!actuador) {
        return res.status(404).json({ error: 'Actuador no encontrado' });
      }
      res.json(actuador);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el actuador por ID', details: error.message });
    }
});

app.post('/', async (req, res) => {
    const { TipoActuador, Ubicacion, idCultivo_fk } = req.body;
    if (!TipoActuador || !Ubicacion || !idCultivo_fk) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
  
    try {
      const newActuador = new Sensor({ TipoActuador, Ubicacion, idCultivo_fk });
      await newSensor.save();
      res.status(201).json({ message: 'Actuador creado en MongoDB', sensor: newSensor });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el actuador en MongoDB', details: error.message });
    }
});

app.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { TipoActuador, Ubicacion, idCultivo_fk } = req.body;
    if (!TipoActuador || !Ubicacion || !idCultivo_fk) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
  
    try {
      const actuador = await Actuador.findByIdAndUpdate(id, { TipoActuador, Ubicacion, idCultivo_fk }, { new: true });
      if (!actuador) {
        return res.status(404).json({ error: 'Actuador no encontrado' });
      }
      res.json({ message: 'Actuador actualizado en MongoDB', actuador });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el actuador en MongoDB', details: error.message });
    }
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const actuador = await Actuador.findByIdAndDelete(id);
      if (!actuador) {
        return res.status(404).json({ error: 'Actuador no encontrado' });
      }
      res.json({ message: 'Actuador eliminado de MongoDB' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el actuador en MongoDB', details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});