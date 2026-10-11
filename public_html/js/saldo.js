/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/*
 * Pokémon Bank
 * Archivo: saldo.js
 *
 * Consulta dinámica del saldo bancario.
 * Simulador académico.
 */

document.addEventListener("DOMContentLoaded", function () {

    // Identificar el elemento HTML del saldo
    const elementoSaldo = document.getElementById("saldoDisponible");

    // Verificar que el elemento exista
    if (!elementoSaldo) {

        console.error(
            "No se encontró el elemento para mostrar el saldo."
        );

        return;
    }

    // Consultar saldo almacenado
    const saldoActual = Banco.obtenerSaldo();

    // Verificar que el saldo sea válido
    if (!Number.isFinite(saldoActual) || saldoActual < 0) {

        elementoSaldo.textContent = "Saldo no disponible";

        console.error(
            "No fue posible recuperar el saldo bancario."
        );

        return;
    }

    // Formatear saldo en dólares estadounidenses
    const saldoFormateado = saldoActual.toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

    // Mostrar saldo actualizado
    elementoSaldo.textContent = saldoFormateado;

    // Mensajes de verificación
    console.log(
        "Pokémon Bank - Consulta de saldo cargada correctamente."
    );

    console.log(
        "Saldo disponible:",
        saldoActual.toFixed(2)
    );

});