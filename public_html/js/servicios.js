/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/*
 * Pokémon Bank
 * Archivo: servicios.js
 *
 * Administración de pagos de servicios.
 * Simulador bancario académico.
 */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    // ==========================================
    // 1. OBTENER ELEMENTOS DEL FORMULARIO
    // ==========================================

    const formulario = document.getElementById("formServicios");

    const campoServicio = document.getElementById("servicio");

    const campoReferencia = document.getElementById("referencia");

    const campoMonto = document.getElementById("monto");


    // ==========================================
    // 2. VERIFICAR ELEMENTOS
    // ==========================================

    if (!formulario ||
        !campoServicio ||
        !campoReferencia ||
        !campoMonto) {

        console.error(
            "Error: No se encontraron los elementos del formulario."
        );

        return;
    }


    // ==========================================
    // 3. VERIFICAR MODULO BANCARIO
    // ==========================================

    if (typeof Banco === "undefined") {

        console.error(
            "Error: El módulo banco.js no está disponible."
        );

        alert(
            "No fue posible cargar el sistema bancario."
        );

        return;
    }


    // ==========================================
    // 4. PROCESAR FORMULARIO
    // ==========================================

    formulario.addEventListener("submit", function (evento) {

        // Evitar redirección automática
        evento.preventDefault();


        // ======================================
        // 5. OBTENER DATOS
        // ======================================

        const servicio = campoServicio.value;

        const referencia = campoReferencia.value.trim();

        const monto = Number(campoMonto.value);


        // ======================================
        // 6. VALIDAR SERVICIO
        // ======================================

        if (!servicio) {

            alert(
                "Selecciona el servicio que deseas pagar."
            );

            campoServicio.focus();

            return;
        }


        // ======================================
        // 7. VALIDAR REFERENCIA
        // ======================================

        if (referencia === "") {

            alert(
                "Ingresa el número de referencia o factura."
            );

            campoReferencia.focus();

            return;
        }


        // ======================================
        // 8. VALIDAR MONTO
        // ======================================

        if (!Number.isFinite(monto) || monto <= 0) {

            alert(
                "Ingresa un monto válido mayor a $0.00."
            );

            campoMonto.focus();

            return;
        }


        // Validar máximo dos decimales
        if (Math.abs(
            monto * 100 - Math.round(monto * 100)
        ) > 0.000001) {

            alert(
                "El monto debe contener como máximo dos decimales."
            );

            campoMonto.focus();

            return;
        }


        // ======================================
        // 9. OBTENER NOMBRE DEL SERVICIO
        // ======================================

        const nombreServicio =
            campoServicio.options[
                campoServicio.selectedIndex
            ].text;


        // ======================================
        // 10. CONSULTAR SALDO
        // ======================================

        const saldoDisponible = Banco.obtenerSaldo();


        // ======================================
        // 11. VALIDAR FONDOS
        // ======================================

        if (monto > saldoDisponible) {

            alert(
                "Saldo insuficiente.\n\n" +
                "Saldo disponible: $" +
                saldoDisponible.toFixed(2)
            );

            campoMonto.focus();

            return;
        }


        // ======================================
        // 12. CONFIRMAR PAGO
        // ======================================

        const confirmacion = confirm(
            "¿Deseas confirmar el pago?\n\n" +
            "Servicio: " + nombreServicio + "\n" +
            "Referencia: " + referencia + "\n" +
            "Monto: $" + monto.toFixed(2) + "\n" +
            "Saldo actual: $" + saldoDisponible.toFixed(2)
        );


        if (!confirmacion) {

            return;
        }


        // ======================================
        // 13. PROCESAR PAGO
        // ======================================

        const resultado = Banco.pagarServicio(
            nombreServicio,
            referencia,
            monto
        );


        // ======================================
        // 14. VERIFICAR RESULTADO
        // ======================================

        if (resultado.exito) {

            const nuevoSaldo = Banco.obtenerSaldo();


            // ==================================
            // 15. MOSTRAR CONFIRMACION
            // ==================================

            alert(
                "¡Pago realizado exitosamente!\n\n" +
                "Servicio: " + nombreServicio + "\n" +
                "Referencia: " + referencia + "\n" +
                "Monto pagado: $" + monto.toFixed(2) + "\n" +
                "Nuevo saldo: $" + nuevoSaldo.toFixed(2)
            );


            // ==================================
            // 16. REGISTRAR EN CONSOLA
            // ==================================

            console.log(
                "Pago realizado correctamente."
            );

            console.log(
                "Servicio:",
                nombreServicio
            );

            console.log(
                "Referencia:",
                referencia
            );

            console.log(
                "Monto pagado:",
                monto.toFixed(2)
            );

            console.log(
                "Nuevo saldo:",
                nuevoSaldo.toFixed(2)
            );


            // ==================================
            // 17. REGRESAR AL DASHBOARD
            // ==================================

            window.location.href = "dashboard.html";

        } else {

            alert(
                resultado.mensaje ||
                "No fue posible realizar el pago."
            );

            console.error(
                "Error al procesar pago:",
                resultado
            );

        }

    });


    // ==========================================
    // 18. CONFIRMAR CARGA DEL MODULO
    // ==========================================

    console.log(
        "Pokémon Bank - Módulo de servicios cargado correctamente."
    );

});