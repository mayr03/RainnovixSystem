// routes/riegoRoutes.js
const express = require('express');
const router = express.Router();
const riegoModel = require('../models/riegoModel');

// GET  /api/riego       -> Listar todos
router.get('/', async (req, res) => {
  try {
    const riegos = await riegoModel.getAllRiegos();
    res.json(riegos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET  /api/riego/:id   -> Obtener uno
router.get('/:id', async (req, res) => {
  try {
    const riego = await riegoModel.getRiegoById(req.params.id);
    if (!riego) return res.status(404).json({ message: 'Riego no encontrado' });
    res.json(riego);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/riego       -> Crear
router.post('/', async (req, res) => {
  try {
    const nuevo = await riegoModel.createRiego(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT  /api/riego/:id   -> Actualizar
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await riegoModel.updateRiego(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/riego/:id -> Eliminar
router.delete('/:id', async (req, res) => {
  try {
    const borrados = await riegoModel.deleteRiego(req.params.id);
    if (borrados === 0) return res.status(404).json({ message: 'Riego no encontrado' });
    res.json({ message: 'Riego eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
