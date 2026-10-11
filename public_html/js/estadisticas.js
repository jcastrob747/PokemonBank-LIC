/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/*
 * Pokémon Bank
 * Archivo: estadisticas.js
 *
 * Módulo de estadísticas bancarias dinámicas.
 *
 * Desafío Práctico - Lenguajes Interpretados en el Cliente
 *
 * Tecnologías:
 * HTML5
 * CSS3
 * JavaScript puro
 * SVG
 *
 * Los datos se obtienen del historial bancario
 * administrado mediante banco.js.
 *
 * No se utilizan bibliotecas externas de gráficos.
 */


// ============================================
// 1. CONFIGURACIÓN DE MOVIMIENTOS
// ============================================

const movimientos = [

    {
        tipo: "Depósitos",
        cantidad: 0,
        monto: 0,
        color: "#28a745"
    },

    {
        tipo: "Retiros",
        cantidad: 0,
        monto: 0,
        color: "#ff3547"
    },

    {
        tipo: "Servicios",
        cantidad: 0,
        monto: 0,
        color: "#ffcc00"
    }

];


// ============================================
// 2. VARIABLES GENERALES
// ============================================

let totalTransacciones = 0;

let totalMontos = 0;


// ============================================
// 3. OBTENER DATOS BANCARIOS
// ============================================

function cargarEstadisticas() {

    // Verificar disponibilidad del módulo bancario

    if (typeof Banco === "undefined") {

        console.error(
            "Error: No se encontró el módulo banco.js."
        );

        return false;

    }

    // Obtener historial almacenado

    const historial = Banco.obtenerHistorial();

    if (!Array.isArray(historial)) {

        console.error(
            "Error: El historial bancario no es válido."
        );

        return false;

    }

    // Reiniciar estadísticas

    movimientos.forEach(function (movimiento) {

        movimiento.cantidad = 0;

        movimiento.monto = 0;

    });

    // Procesar transacciones

    historial.forEach(function (transaccion) {

        const monto = Number(transaccion.monto);

        if (!Number.isFinite(monto) || monto <= 0) {
            return;
        }

        let categoria = null;

        switch (transaccion.tipo) {

            case "Depósito":

                categoria = movimientos[0];

                break;

            case "Retiro":

                categoria = movimientos[1];

                break;

            case "Servicio":

                categoria = movimientos[2];

                break;

            default:

                console.warn(
                    "Tipo de transacción no reconocido:",
                    transaccion.tipo
                );

                return;

        }

        categoria.cantidad++;

        categoria.monto += monto;

    });

    // Calcular total de transacciones

    totalTransacciones = movimientos.reduce(

        function (total, movimiento) {

            return total + movimiento.cantidad;

        },

        0

    );

    // Calcular suma de montos

    totalMontos = movimientos.reduce(

        function (total, movimiento) {

            return total + movimiento.monto;

        },

        0

    );

    return true;

}


// ============================================
// 4. FORMATO MONETARIO
// ============================================

function formatoMoneda(monto) {

    return "$" + Number(monto).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


// ============================================
// 5. ACTUALIZAR RESUMEN HTML
// ============================================

function actualizarResumen() {

    const elementos = [

        {
            idMonto: "totalDepositos",
            idCantidad: "cantidadDepositos",
            movimiento: movimientos[0]
        },

        {
            idMonto: "totalRetiros",
            idCantidad: "cantidadRetiros",
            movimiento: movimientos[1]
        },

        {
            idMonto: "totalServicios",
            idCantidad: "cantidadServicios",
            movimiento: movimientos[2]
        }

    ];

    elementos.forEach(function (elemento) {

        const campoMonto = document.getElementById(
            elemento.idMonto
        );

        const campoCantidad = document.getElementById(
            elemento.idCantidad
        );

        if (campoMonto) {

            campoMonto.textContent = formatoMoneda(
                elemento.movimiento.monto
            );

        }

        if (campoCantidad) {

            const cantidad = elemento.movimiento.cantidad;

            campoCantidad.textContent = cantidad +
                (cantidad === 1
                    ? " transacción"
                    : " transacciones");

        }

    });

    // Actualizar total general

    const campoTotal = document.getElementById(
        "totalTransacciones"
    );

    if (campoTotal) {

        campoTotal.textContent = totalTransacciones;

    }

}


// ============================================
// 6. GRÁFICO DE DISTRIBUCIÓN
// ============================================

function generarGraficoDistribucion() {

    const contenedor = document.getElementById(
        "graficoDistribucion"
    );

    if (!contenedor) {
        return;
    }

    const radio = 80;

    const circunferencia = 2 * Math.PI * radio;

    let desplazamiento = 0;

    let svg = `

        <svg
            viewBox="0 0 300 260"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Distribución de operaciones bancarias"
            style="width:100%; max-width:300px; height:auto;"
        >

            <circle
                cx="150"
                cy="115"
                r="${radio}"
                fill="none"
                stroke="#e9ecef"
                stroke-width="35"
            />

    `;

    // Dibujar segmentos

    movimientos.forEach(function (movimiento) {

        const porcentaje = totalTransacciones > 0
            ? movimiento.cantidad / totalTransacciones
            : 0;

        const longitud = porcentaje * circunferencia;

        svg += `

            <circle
                cx="150"
                cy="115"
                r="${radio}"
                fill="none"
                stroke="${movimiento.color}"
                stroke-width="35"
                stroke-dasharray="${longitud} ${circunferencia}"
                stroke-dashoffset="${-desplazamiento}"
                transform="rotate(-90 150 115)"
            />

        `;

        desplazamiento += longitud;

    });

    // Texto central

    svg += `

            <text
                x="150"
                y="110"
                text-anchor="middle"
                font-size="30"
                font-weight="bold"
                fill="#173f9b"
            >
                ${totalTransacciones}
            </text>

            <text
                x="150"
                y="135"
                text-anchor="middle"
                font-size="13"
                fill="#555555"
            >
                Transacciones
            </text>

        </svg>

    `;

    contenedor.innerHTML = svg;

    // Crear leyenda

    const leyenda = document.createElement("div");

    leyenda.className = "chart-legend";

    movimientos.forEach(function (movimiento) {

        const porcentaje = totalTransacciones > 0
            ? (movimiento.cantidad / totalTransacciones) * 100
            : 0;

        const elemento = document.createElement("div");

        elemento.className = "chart-legend-item";

        elemento.innerHTML = `

            <span
                class="chart-legend-color"
                style="background-color:${movimiento.color}">
            </span>

            <span>
                ${movimiento.tipo}:
                ${porcentaje.toFixed(2)}%
            </span>

        `;

        leyenda.appendChild(elemento);

    });

    contenedor.appendChild(leyenda);

}


// ============================================
// 7. GRÁFICO COMPARATIVO DE MONTOS
// ============================================

function generarGraficoMontos() {

    const contenedor = document.getElementById(
        "graficoMontos"
    );

    if (!contenedor) {
        return;
    }

    const ancho = 400;

    const alto = 280;

    const margenIzquierdo = 55;

    const margenSuperior = 25;

    const alturaGrafico = 180;

    const anchoBarra = 65;

    const montoMaximo = Math.max(
        ...movimientos.map(
            movimiento => movimiento.monto
        )
    );

    let svg = `

        <svg
            viewBox="0 0 ${ancho} ${alto}"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Comparación de montos bancarios"
            style="width:100%; max-width:400px; height:auto;"
        >

    `;

    // Línea horizontal inferior

    svg += `

        <line
            x1="${margenIzquierdo}"
            y1="${margenSuperior + alturaGrafico}"
            x2="390"
            y2="${margenSuperior + alturaGrafico}"
            stroke="#999999"
            stroke-width="1"
        />

    `;

    // Generar barras

    movimientos.forEach(function (movimiento, indice) {

        const alturaBarra = montoMaximo > 0
            ? (movimiento.monto / montoMaximo) * alturaGrafico
            : 0;

        const x = margenIzquierdo + 35 + indice * 105;

        const y = margenSuperior +
            alturaGrafico - alturaBarra;

        svg += `

            <rect
                x="${x}"
                y="${y}"
                width="${anchoBarra}"
                height="${alturaBarra}"
                fill="${movimiento.color}"
                rx="5"
            />

            <text
                x="${x + anchoBarra / 2}"
                y="${Math.max(y - 8, 14)}"
                text-anchor="middle"
                font-size="13"
                font-weight="bold"
                fill="#173f9b"
            >
                ${formatoMoneda(movimiento.monto)}
            </text>

            <text
                x="${x + anchoBarra / 2}"
                y="${margenSuperior + alturaGrafico + 22}"
                text-anchor="middle"
                font-size="12"
                fill="#173f9b"
            >
                ${movimiento.tipo}
            </text>

        `;

    });

    svg += `

        </svg>

    `;

    contenedor.innerHTML = svg;

}


// ============================================
// 8. INICIALIZACIÓN
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const datosCargados = cargarEstadisticas();

    if (!datosCargados) {
        return;
    }

    // Actualizar tarjetas

    actualizarResumen();

    // Generar gráficos

    generarGraficoDistribucion();

    generarGraficoMontos();

    // Información de diagnóstico

    console.log(
        "Pokémon Bank - Estadísticas dinámicas cargadas correctamente."
    );

    console.log(
        "Total de transacciones:",
        totalTransacciones
    );

    console.log(
        "Total de montos:",
        totalMontos.toFixed(2)
    );

    console.log(
        "Resumen por categoría:",
        movimientos
    );

});