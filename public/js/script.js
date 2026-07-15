document.addEventListener('DOMContentLoaded', function() {
    const numero1 = document.getElementById('numero1');
    const numero2 = document.getElementById('numero2');
    const btnSumar = document.getElementById('btnSumar');
    const resultadoDiv = document.getElementById('resultado');
    const loadingDiv = document.getElementById('loading');

    // URL de la API
    const API_URL = '/sumar';

    function mostrarResultado(mensaje, tipo = 'normal', htmlPersonalizado = null) {
        resultadoDiv.className = 'resultado';
        
        if (tipo === 'exito') {
            resultadoDiv.classList.add('exito');
        } else if (tipo === 'error') {
            resultadoDiv.classList.add('error');
        }

        if (htmlPersonalizado) {
            resultadoDiv.innerHTML = htmlPersonalizado;
        } else {
            resultadoDiv.innerHTML = `<p>${mensaje}</p>`;
        }
    }

    async function sumarNumeros() {
        const val1 = numero1.value.trim();
        const val2 = numero2.value.trim();

        if (val1 === '' || val2 === '') {
            mostrarResultado('⚠️ Por favor ingresa ambos números', 'error');
            return;
        }

        if (isNaN(val1) || isNaN(val2)) {
            mostrarResultado('⚠️ Por favor ingresa números válidos', 'error');
            return;
        }

        loadingDiv.style.display = 'block';
        btnSumar.disabled = true;
        resultadoDiv.className = 'resultado';
        resultadoDiv.innerHTML = '<p>⏳ Enviando solicitud...</p>';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numero1: parseFloat(val1),
                    numero2: parseFloat(val2)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar la solicitud');
            }

            mostrarResultado(
                '',
                'exito',
                `
                    <div style="text-align: center; width: 100%;">
                        <p style="font-size: 14px; color: #155724; margin-bottom: 5px;">✅ ${data.mensaje}</p>
                        <div style="font-size: 20px; margin-top: 5px;">
                            <strong>${data.numero1}</strong> + <strong>${data.numero2}</strong> = 
                            <strong style="color: #28a745; font-size: 28px;">${data.resultado}</strong>
                        </div>
                    </div>
                `
            );

        } catch (error) {
            console.error('Error:', error);
            mostrarResultado(`❌ Error: ${error.message}`, 'error');
        } finally {
            loadingDiv.style.display = 'none';
            btnSumar.disabled = false;
        }
    }

    btnSumar.addEventListener('click', sumarNumeros);

    numero1.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') btnSumar.click();
    });
    
    numero2.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') btnSumar.click();
    });
});