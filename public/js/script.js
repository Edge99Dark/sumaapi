document.addEventListener('DOMContentLoaded', function() {
    // -------- Navegación por pestañas --------
    const tabs = document.querySelectorAll('.tab-btn');
    const pages = {
        page1: document.getElementById('page1'),
        page2: document.getElementById('page2')
    };

    tabs.forEach(btn => {
        btn.addEventListener('click', function() {
            tabs.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const pageId = this.dataset.page;
            Object.keys(pages).forEach(key => {
                pages[key].classList.toggle('active-page', key === pageId);
            });
        });
    });

    // -------- Función genérica para llamar a la API --------
    async function callApi(endpoint, data) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error al procesar la solicitud');
        }

        return result;
    }

    // -------- Función para mostrar resultados --------
    function mostrarResultado(element, mensaje, tipo = 'normal', htmlPersonalizado = null) {
        element.className = 'resultado';
        
        if (tipo === 'exito') {
            element.classList.add('exito');
        } else if (tipo === 'error') {
            element.classList.add('error');
        }

        if (htmlPersonalizado) {
            element.innerHTML = htmlPersonalizado;
        } else {
            element.innerHTML = `<p>${mensaje}</p>`;
        }
    }

    // -------- Función para manejar operaciones aritméticas --------
    function configurarOperacion(btnId, input1Id, input2Id, resultId, operacion, simbolo) {
        const btn = document.getElementById(btnId);
        const input1 = document.getElementById(input1Id);
        const input2 = document.getElementById(input2Id);
        const resultDiv = document.getElementById(resultId);

        btn.addEventListener('click', async function() {
            const val1 = input1.value.trim();
            const val2 = input2.value.trim();

            if (val1 === '' || val2 === '') {
                mostrarResultado(resultDiv, '⚠️ Por favor ingresa ambos números', 'error');
                return;
            }

            if (isNaN(val1) || isNaN(val2)) {
                mostrarResultado(resultDiv, '⚠️ Por favor ingresa números válidos', 'error');
                return;
            }

            resultDiv.innerHTML = '<p>⏳ Calculando...</p>';
            resultDiv.className = 'resultado';

            try {
                const data = await callApi('/api/calc', {
                    operation: operacion,
                    num1: parseFloat(val1),
                    num2: parseFloat(val2)
                });

                mostrarResultado(
                    resultDiv,
                    '',
                    'exito',
                    `
                        <div style="text-align: center; width: 100%;">
                            <p style="font-size: 14px; color: #155724; margin-bottom: 5px;">✅ Operación exitosa</p>
                            <div style="font-size: 20px; margin-top: 5px;">
                                <strong>${parseFloat(val1)}</strong> ${simbolo} <strong>${parseFloat(val2)}</strong> = 
                                <strong style="color: #28a745; font-size: 28px;">${data.result}</strong>
                            </div>
                        </div>
                    `
                );

            } catch (error) {
                console.error('Error:', error);
                mostrarResultado(resultDiv, `❌ Error: ${error.message}`, 'error');
            }
        });

        // Permitir Enter en los inputs
        [input1, input2].forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') btn.click();
            });
        });
    }

    // -------- Configurar operaciones aritméticas (Página 1) --------
    configurarOperacion('btnSum', 'sum1', 'sum2', 'resultSum', 'sum', '+');
    configurarOperacion('btnSub', 'sub1', 'sub2', 'resultSub', 'sub', '−');
    configurarOperacion('btnMul', 'mul1', 'mul2', 'resultMul', 'mul', '×');
    configurarOperacion('btnDiv', 'div1', 'div2', 'resultDiv', 'div', '÷');

    // -------- Función para manejar áreas --------
    function configurarArea(btnId, inputs, resultId, shape, label, formulaText) {
        const btn = document.getElementById(btnId);
        const resultDiv = document.getElementById(resultId);
        const inputElements = inputs.map(id => document.getElementById(id));

        btn.addEventListener('click', async function() {
            const values = inputElements.map(input => input.value.trim());

            // Verificar que todos los campos tengan valor
            if (values.some(v => v === '')) {
                mostrarResultado(resultDiv, '⚠️ Por favor ingresa todos los valores', 'error');
                return;
            }

            // Verificar que todos sean números válidos
            if (values.some(v => isNaN(v))) {
                mostrarResultado(resultDiv, '⚠️ Por favor ingresa números válidos', 'error');
                return;
            }

            const numeros = values.map(v => parseFloat(v));

            // Validar que los números sean positivos
            if (numeros.some(n => n <= 0)) {
                mostrarResultado(resultDiv, '⚠️ Los valores deben ser mayores a 0', 'error');
                return;
            }

            resultDiv.innerHTML = '<p>⏳ Calculando...</p>';
            resultDiv.className = 'resultado';

            try {
                let params = {};
                if (shape === 'square') {
                    params = { side: numeros[0] };
                } else if (shape === 'triangle') {
                    params = { base: numeros[0], height: numeros[1] };
                } else if (shape === 'circle') {
                    params = { radius: numeros[0] };
                }

                const data = await callApi('/api/area', {
                    shape: shape,
                    params: params
                });

                // Mostrar la fórmula con los valores
                let formulaDisplay = formulaText;
                if (shape === 'square') {
                    formulaDisplay = `${numeros[0]}²`;
                } else if (shape === 'triangle') {
                    formulaDisplay = `(${numeros[0]} × ${numeros[1]}) / 2`;
                } else if (shape === 'circle') {
                    formulaDisplay = `π × ${numeros[0]}²`;
                }

                mostrarResultado(
                    resultDiv,
                    '',
                    'exito',
                    `
                        <div style="text-align: center; width: 100%;">
                            <p style="font-size: 14px; color: #155724; margin-bottom: 5px;">✅ ${label}</p>
                            <div style="font-size: 16px; margin-top: 5px;">
                                <strong>${formulaDisplay}</strong> = 
                                <strong style="color: #28a745; font-size: 28px;">${typeof data.result === 'number' ? data.result.toFixed(4) : data.result}</strong>
                            </div>
                        </div>
                    `
                );

            } catch (error) {
                console.error('Error:', error);
                mostrarResultado(resultDiv, `❌ Error: ${error.message}`, 'error');
            }
        });

        // Permitir Enter en los inputs
        inputElements.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') btn.click();
            });
        });
    }

    // -------- Configurar áreas (Página 2) --------
    configurarArea('btnSquare', ['squareSide'], 'resultSquare', 'square', 'Área del cuadrado', 'l²');
    configurarArea('btnTriangle', ['triBase', 'triHeight'], 'resultTriangle', 'triangle', 'Área del triángulo', '(b × h) / 2');
    configurarArea('btnCircle', ['circleRadius'], 'resultCircle', 'circle', 'Área del círculo', 'π × r²');
});