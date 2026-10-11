/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/*
 * Pokémon Bank
 * Módulo de retiros bancarios
 *
 * Simulador bancario académico
 * Lenguajes Interpretados en el Cliente
 */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    // ==========================================
    // 1. OBTENER ELEMENTOS DEL FORMULARIO
    // ==========================================

    const formulario = document.getElementById("formRetiro");

    const campoMonto = document.getElementById("montoRetiro");


    // ==========================================
    // 2. VERIFICAR ELEMENTOS
    // ==========================================

    if (!formulario || !campoMonto) {

        console.error(
            "Error: No se encontraron los elementos del formulario de retiro."
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

        // Evitar recarga automática de la página
        evento.preventDefault();


        // ======================================
        // 5. OBTENER MONTO
        // ======================================

        const monto = Number(campoMonto.value);


        // ======================================
        // 6. VALIDAR MONTO
        // ======================================

        if (!Number.isFinite(monto) || monto <= 0) {

            alert(
                "Ingresa un monto válido mayor a $0.00."
            );

            campoMonto.focus();

            return;
        }


        // Validar máximo dos decimales
        if (!Number.isInteger(Math.round(monto * 100)) ||
            Math.abs(monto * 100 - Math.round(monto * 100)) > 0.000001) {

            alert(
                "El monto debe contener como máximo dos decimales."
            );

            campoMonto.focus();

            return;
        }


        // ======================================
        // 7. CONSULTAR SALDO DISPONIBLE
        // ======================================

        const saldoDisponible = Banco.obtenerSaldo();


        // ======================================
        // 8. VERIFICAR FONDOS
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
        // 9. CONFIRMAR OPERACION
        // ======================================

        const confirmacion = confirm(
            "¿Deseas confirmar el retiro?\n\n" +
            "Monto: $" + monto.toFixed(2) + "\n" +
            "Saldo actual: $" + saldoDisponible.toFixed(2)
        );


        if (!confirmacion) {

            return;
        }


        // ======================================
        // 10. REALIZAR RETIRO
        // ======================================

        const resultado = Banco.retirar(monto);


        // ======================================
        // 11. VERIFICAR RESULTADO
        // ======================================

        if (resultado.exito) {

            const nuevoSaldo = Banco.obtenerSaldo();

            alert(
                "¡Retiro realizado exitosamente!\n\n" +
                "Monto retirado: $" + monto.toFixed(2) + "\n" +
                "Nuevo saldo: $" + nuevoSaldo.toFixed(2)
            );


            // ==================================
            // 12. REGISTRAR INFORMACION
            // ==================================

            console.log(
                "Retiro realizado correctamente."
            );

            console.log(
                "Monto retirado:",
                monto.toFixed(2)
            );

            console.log(
                "Nuevo saldo:",
                nuevoSaldo.toFixed(2)
            );


            // ==================================
            // 13. REGRESAR AL DASHBOARD
            // ==================================

            window.location.href = "dashboard.html";

        } else {

            alert(
                resultado.mensaje ||
                "No fue posible realizar el retiro."
            );

            console.error(
                "Error al realizar retiro:",
                resultado
            );

        }

    });


    // ==========================================
    // 14. CONFIRMAR CARGA DEL MODULO
    // ==========================================

    console.log(
        "Pokémon Bank - Módulo de retiros cargado correctamente."
    );

});