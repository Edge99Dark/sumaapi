const express = require('express');
const app = express();
const port = 3000;

// Configuración para usar EJS y archivos estáticos
app.set('view engine', 'ejs');
app.use(express.static('public')); // <-- Esto sirve para toda la carpeta public
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

// ---------- ENDPOINTS PARA OPERACIONES ARITMÉTICAS ----------
app.post('/api/calc', (req, res) => {
    const { operation, num1, num2 } = req.body;
    let result;

    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    if (isNaN(n1) || isNaN(n2)) {
        return res.status(400).json({ error: 'Ambos valores deben ser números válidos.' });
    }

    switch (operation) {
        case 'sum':
            result = n1 + n2;
            break;
        case 'sub':
            result = n1 - n2;
            break;
        case 'mul':
            result = n1 * n2;
            break;
        case 'div':
            if (n2 === 0) {
                return res.status(400).json({ error: 'No se puede dividir por cero.' });
            }
            result = n1 / n2;
            break;
        default:
            return res.status(400).json({ error: 'Operación no soportada.' });
    }

    res.json({ result });
});

// ---------- ENDPOINTS PARA ÁREAS ----------
app.post('/api/area', (req, res) => {
    const { shape, params } = req.body;
    let result;

    switch (shape) {
        case 'square':
            const side = parseFloat(params.side);
            if (isNaN(side) || side <= 0) {
                return res.status(400).json({ error: 'El lado debe ser un número mayor a 0.' });
            }
            result = side * side;
            break;
        case 'triangle':
            const base = parseFloat(params.base);
            const height = parseFloat(params.height);
            if (isNaN(base) || isNaN(height) || base <= 0 || height <= 0) {
                return res.status(400).json({ error: 'Base y altura deben ser números mayores a 0.' });
            }
            result = (base * height) / 2;
            break;
        case 'circle':
            const radius = parseFloat(params.radius);
            if (isNaN(radius) || radius <= 0) {
                return res.status(400).json({ error: 'El radio debe ser un número mayor a 0.' });
            }
            result = Math.PI * radius * radius;
            break;
        default:
            return res.status(400).json({ error: 'Forma no soportada.' });
    }

    res.json({ result });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});