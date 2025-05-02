const express = require('express');
const router = express.Router();
const { pool } = require('../config/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/login', async (req,res)=>{
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM Usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        return res.json({
        token,
        user: {
            id: user.id,
            email: user.email
      }
    });
    } catch (error) {
        console.error('Error en el login',error);
        res.status(500).json({message:'Error en el servidor'});
    }
});

module.exports=router;