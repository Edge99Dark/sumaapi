const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static('public'));

// Ruta principal - Renderiza index.ejs
app.get('/', (req, res) => {
    res.render('index', { 
        titulo: 'Calculadora de Suma',
        resultado: null,
        error: null
    });
});

// Ruta para la suma (API)
app.post('/sumar', (req, res) => {
    try {
        const { numero1, numero2 } = req.body;
        
        if (numero1 === undefined || numero2 === undefined) {
            return res.status(400).json({ 
                error: 'Se requieren dos números para sumar' 
            });
        }
        
        const num1 = parseFloat(numero1);
        const num2 = parseFloat(numero2);
        
        if (isNaN(num1) || isNaN(num2)) {
            return res.status(400).json({ 
                error: 'Los valores deben ser números válidos' 
            });
        }
        
        const resultado = num1 + num2;
        
        res.json({
            numero1: num1,
            numero2: num2,
            resultado: resultado,
            mensaje: `La suma de ${num1} + ${num2} = ${resultado}`
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}/`);
    console.log(`📁 Usando EJS con vistas en: ${path.join(__dirname, 'views')}`);
});