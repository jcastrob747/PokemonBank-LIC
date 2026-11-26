/* Pokémon Bank - Fase 2
 * Estadísticas bancarias con Chart.js.
 * Consulta de solo lectura; los cálculos se realizan en centavos enteros.
 */
const Estadisticas = (() => {
    const categorias = [
        { tipo: 'Depósito', etiqueta: 'Depósitos', sufijo: 'Depositos', color: '#28a745' },
        { tipo: 'Retiro', etiqueta: 'Retiros', sufijo: 'Retiros', color: '#ff3547' },
        { tipo: 'Servicio', etiqueta: 'Servicios', sufijo: 'Servicios', color: '#ffcc00' }
    ];
    let graficos = [];
    const elemento = id => document.getElementById(id);
    const moneda = centavos => (centavos / 100).toLocaleString('en-US', {
        style: 'currency', currency: 'USD'
    });

    // Agrupar las operaciones sin modificar el historial original.
    function resumir(historial) {
        const resumen = categorias.map(c => ({ ...c, cantidad: 0, centavos: 0 }));
        historial.forEach(t => {
            const categoria = resumen.find(c => c.tipo === t.tipo);
            if (!categoria || !Number.isSafeInteger(t.montoCentavos) || t.montoCentavos <= 0) {
                throw new Error('Transacción no válida.');
            }
            categoria.cantidad++;
            categoria.centavos += t.montoCentavos;
            if (!Number.isSafeInteger(categoria.centavos)) throw new Error('Total fuera de rango.');
        });
        return resumen;
    }

    // Presentar datos de la cuenta, cantidades, montos y porcentajes.
    function mostrarResumen(usuario, resumen, total) {
        elemento('nombreUsuario').textContent = usuario.nombre;
        elemento('numeroCuenta').textContent = usuario.cuenta;
        elemento('tipoCuenta').textContent = usuario.tipoCuenta;
        elemento('totalTransacciones').textContent = total;
        const leyenda = elemento('leyendaDistribucion');
        leyenda.replaceChildren();
        resumen.forEach(c => {
            elemento('total' + c.sufijo).textContent = moneda(c.centavos);
            elemento('cantidad' + c.sufijo).textContent = c.cantidad +
                (c.cantidad === 1 ? ' transacción' : ' transacciones');
            const fila = document.createElement('div');
            fila.className = 'chart-legend-item';
            const color = document.createElement('span');
            color.className = 'chart-legend-color';
            color.style.backgroundColor = c.color;
            const texto = document.createElement('span');
            texto.textContent = c.etiqueta + ': ' + (total ? c.cantidad / total * 100 : 0).toFixed(2) + '%';
            fila.append(color, texto);
            leyenda.appendChild(fila);
        });
        elemento('sinMovimientos').classList.toggle('d-none', total !== 0);
    }

    // Crear gráficos interactivos y liberar instancias anteriores.
    function destruirGraficos() {
        graficos.forEach(g => g.destroy());
        graficos = [];
    }
    function dibujar(resumen, total) {
        destruirGraficos();
        const etiquetas = resumen.map(c => c.etiqueta);
        const colores = resumen.map(c => c.color);
        graficos.push(new Chart(elemento('chartDistribucion'), {
            type: 'doughnut',
            data: { labels: etiquetas, datasets: [{
                label: 'Cantidad de transacciones',
                data: resumen.map(c => c.cantidad), backgroundColor: colores
            }] },
            options: { responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: {
                    label: ctx => `${ctx.label}: ${ctx.raw} (${(total ? ctx.raw / total * 100 : 0).toFixed(2)}%)`
                } } }
            }
        }));
        graficos.push(new Chart(elemento('chartMontos'), {
            type: 'bar',
            data: { labels: etiquetas, datasets: [{ label: 'Monto acumulado (USD)',
                data: resumen.map(c => c.centavos / 100), backgroundColor: colores, borderRadius: 5
            }] },
            options: { responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: {
                    label: ctx => moneda(Math.round(ctx.raw * 100))
                } } },
                scales: { y: { beginAtZero: true, ticks: { callback: v => '$' + v } } }
            }
        }));
    }

    // Validar sesión y estructura bancaria antes de mostrar información.
    function inicializar() {
        try {
            if (typeof Sesion === 'undefined' || !Sesion.estaActiva()) return;
            if (typeof Banco === 'undefined') throw new Error('Motor bancario no disponible.');
            if (!Banco.validarDatos(Banco.obtenerDatos())) throw new Error('Datos bancarios inválidos.');
            const historial = Banco.obtenerHistorial();
            if (!Array.isArray(historial)) throw new Error('Historial inválido.');
            const resumen = resumir(historial);
            mostrarResumen(Banco.obtenerUsuario(), resumen, historial.length);
            if (typeof Chart === 'undefined') throw new Error('Chart.js no disponible.');
            elemento('contenidoEstadisticas').classList.remove('d-none');
            dibujar(resumen, historial.length);
            elemento('errorEstadisticas').classList.add('d-none');
            console.log('Pokémon Bank - Estadísticas de Fase 2 inicializadas.');
            console.table(resumen);
        } catch (error) {
            destruirGraficos();
            elemento('contenidoEstadisticas').classList.add('d-none');
            const aviso = elemento('errorEstadisticas');
            aviso.textContent = 'No fue posible cargar las estadísticas. Actualiza la página e intenta nuevamente.';
            aviso.classList.remove('d-none');
            console.error('Pokémon Bank - Error de estadísticas:', error);
            if (typeof Swal !== 'undefined') Swal.fire({ icon: 'error', title: 'Estadísticas no disponibles', text: aviso.textContent, confirmButtonText: 'Aceptar' });
        }
    }
    return { inicializar, resumir };
})();
document.addEventListener('DOMContentLoaded', Estadisticas.inicializar);
window.addEventListener('pageshow', e => { if (e.persisted) Estadisticas.inicializar(); });
window.addEventListener('storage', e => { if (typeof Banco !== 'undefined' && e.key === Banco.claveDatos) Estadisticas.inicializar(); });
