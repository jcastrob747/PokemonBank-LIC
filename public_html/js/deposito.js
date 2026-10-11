/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/*
 * Pokémon Bank
 * Archivo: deposito.js
 *
 * Procesamiento de depósitos bancarios.
 * Simulador académico.
 */

document.addEventListener("DOMContentLoaded", function () {

    // Obtener elementos del formulario
    const formulario = document.getElementById("formDeposito");

    const campoMonto = document.getElementById("montoDeposito");

    const mensaje = document.getElementById("mensajeDeposito");

    // Verificar que los elementos existan
    if (!formulario || !campoMonto || !mensaje) {

        console.error(
            "No se encontraron los elementos del formulario de depósito."
        );

        return;
    }

    // Procesar envío del formulario
    formulario.addEventListener("submit", function (evento) {

        // Evitar recarga de página
        evento.preventDefault();

        // Limpiar mensajes anteriores
        mensaje.innerHTML = "";

        // Obtener el monto ingresado
        const monto = Number(campoMonto.value);

        // Validar monto
        if (!Number.isFinite(monto) || monto <= 0 ||
            !Number.isInteger(monto * 100)) {

            mensaje.innerHTML = `
                <div class="alert alert-danger">
                    Ingresa un monto válido mayor a $0.00,
                    con un máximo de dos decimales.
                </div>
            `;

            return;
        }

        // Solicitar confirmación
        const confirmar = confirm(
            "¿Deseas realizar un depósito de $" +
            monto.toFixed(2) + "?"
        );

        if (!confirmar) {
            return;
        }

        // Ejecutar operación bancaria
        const resultado = Banco.depositar(monto);

        // Verificar resultado
        if (resultado.exito) {

            mensaje.innerHTML = `
                <div class="alert alert-success">
                    <strong>Depósito exitoso.</strong>
                    <br>
                    Monto depositado: $${monto.toFixed(2)}
                    <br>
                    Nuevo saldo: $${resultado.saldo.toFixed(2)}
                </div>
            `;

            // Limpiar formulario
            formulario.reset();

            console.log(
                "Depósito registrado correctamente."
            );

            console.log(
                "Nuevo saldo:",
                resultado.saldo.toFixed(2)
            );

        } else {

            mensaje.innerHTML = `
                <div class="alert alert-danger">
                    ${resultado.mensaje}
                </div>
            `;

        }

    });

});

