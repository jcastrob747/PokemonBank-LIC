/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/*
 * Pokémon Bank
 * Historial dinámico de transacciones
 *
 * Proyecto académico
 * Lenguajes Interpretados en el Cliente
 */

// Esperar a que el documento HTML termine de cargar
document.addEventListener("DOMContentLoaded", function () {

    console.log(
        "Pokémon Bank - Historial cargado correctamente."
    );

    // Obtener elementos del HTML
    const tablaHistorial =
        document.getElementById("tablaHistorial");

    const totalTransacciones =
        document.getElementById("totalTransacciones");

    // Verificar que los elementos existan
    if (!tablaHistorial || !totalTransacciones) {

        console.error(
            "No se encontraron los elementos del historial."
        );

        return;
    }

    // Verificar que el módulo bancario esté disponible
    if (
        typeof Banco === "undefined" ||
        typeof Banco.obtenerHistorial !== "function"
    ) {

        console.error(
            "El módulo Banco no está disponible."
        );

        return;
    }

    // Obtener las transacciones almacenadas
    const historial = Banco.obtenerHistorial();

    // Verificar que el resultado sea un arreglo
    if (!Array.isArray(historial)) {

        console.error(
            "El historial bancario no tiene un formato válido."
        );

        return;
    }

    // Actualizar cantidad de transacciones
    totalTransacciones.textContent = historial.length;

    // Limpiar tabla
    tablaHistorial.innerHTML = "";

    // Verificar si existen movimientos
    if (historial.length === 0) {

        const fila = document.createElement("tr");

        const celda = document.createElement("td");

        celda.colSpan = 4;

        celda.className = "text-center";

        celda.textContent =
            "No existen transacciones registradas.";

        fila.appendChild(celda);

        tablaHistorial.appendChild(fila);

        console.log(
            "No existen movimientos bancarios registrados."
        );

        return;
    }

    // Recorrer las transacciones
    historial.forEach(function (transaccion) {

        // Crear fila
        const fila = document.createElement("tr");

        // Crear celdas
        const celdaFecha = document.createElement("td");

        const celdaTipo = document.createElement("td");

        const celdaDescripcion = document.createElement("td");

        const celdaMonto = document.createElement("td");

        // Fecha
        celdaFecha.textContent =
            transaccion.fecha || "Sin fecha";

        // Tipo de transacción
        const tipo = String(
            transaccion.tipo || ""
        ).trim();

        const tipoNormalizado = tipo.toLowerCase();

        // Crear etiqueta visual
        const etiqueta = document.createElement("span");

        etiqueta.textContent = tipo || "Otro";

        // Identificar el tipo de operación
        const esDeposito =
            tipoNormalizado === "depósito" ||
            tipoNormalizado === "deposito";

        const esRetiro =
            tipoNormalizado === "retiro";

        const esServicio =
            tipoNormalizado === "servicio" ||
            tipoNormalizado === "pago de servicio" ||
            tipoNormalizado === "pago de servicios";

        if (esDeposito) {

            etiqueta.className =
                "badge badge-success";

        } else if (esRetiro) {

            etiqueta.className =
                "badge badge-danger";

        } else if (esServicio) {

            etiqueta.className =
                "badge badge-warning";

        } else {

            etiqueta.className =
                "badge badge-secondary";

        }

        celdaTipo.appendChild(etiqueta);

        // Descripción
        celdaDescripcion.textContent =
            transaccion.descripcion || "Sin descripción";

        // Monto
        const monto = Number(transaccion.monto);

        if (!Number.isFinite(monto)) {

            celdaMonto.textContent = "Monto inválido";

        } else {

            const montoFormateado =
                Math.abs(monto).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

            if (esDeposito) {

                celdaMonto.textContent =
                    "+$" + montoFormateado;

                celdaMonto.className =
                    "amount-positive";

            } else {

                celdaMonto.textContent =
                    "-$" + montoFormateado;

                celdaMonto.className =
                    "amount-negative";

            }

        }

        // Agregar celdas a la fila
        fila.appendChild(celdaFecha);

        fila.appendChild(celdaTipo);

        fila.appendChild(celdaDescripcion);

        fila.appendChild(celdaMonto);

        // Agregar fila a la tabla
        tablaHistorial.appendChild(fila);

    });

    // Confirmación en consola
    console.log(
        "Total de transacciones cargadas:",
        historial.length
    );

    console.log(
        "Historial bancario:",
        historial
    );

});
