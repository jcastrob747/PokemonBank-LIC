/*
 * Pokémon Bank - Fase 2
 * Archivo: deposito.js
 *
 * Procesamiento de depósitos bancarios.
 * Validación, confirmación, persistencia y comprobantes.
 */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    // ==========================================
    // 1. ELEMENTOS DE LA INTERFAZ
    // ==========================================

    const formulario = document.getElementById("formDeposito");
    const campoMonto = document.getElementById("montoDeposito");
    const mensaje = document.getElementById("mensajeDeposito");

    if (!formulario || !campoMonto || !mensaje) {
        console.error("Pokémon Bank - Formulario de depósito incompleto.");
        return;
    }

    let procesando = false;

    // ==========================================
    // 2. FUNCIONES AUXILIARES
    // ==========================================

    function formatearMonto(monto) {
        return "$" + Number(monto).toFixed(2);
    }

    function mostrarMensaje(texto, tipo) {

        mensaje.textContent = texto;
        mensaje.className = "mt-3 alert alert-" + tipo;

    }

    function limpiarMensaje() {

        mensaje.textContent = "";
        mensaje.className = "mt-3";

    }

    // ==========================================
    // 3. INICIALIZACIÓN DEL MÓDULO
    // ==========================================

    try {

        if (
            typeof Banco === "undefined" ||
            typeof Transacciones === "undefined" ||
            typeof validate !== "function" ||
            typeof Swal === "undefined"
        ) {
            throw new Error("Dependencias del módulo no disponibles.");
        }

        Transacciones.cargarUsuario();

        console.log(
            "Pokémon Bank - Módulo de depósitos de Fase 2 inicializado."
        );

    } catch (error) {

        console.error("Pokémon Bank - Error de inicialización:", error);

        mostrarMensaje(
            "No fue posible inicializar el módulo de depósitos.",
            "danger"
        );

        formulario.querySelectorAll("input, button").forEach(function (elemento) {
            elemento.disabled = true;
        });

        return;

    }

    // ==========================================
    // 4. PROCESAMIENTO DEL FORMULARIO
    // ==========================================

    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        if (procesando) {
            return;
        }

        procesando = true;

        limpiarMensaje();

        try {

            // ==================================
            // 5. VALIDACIÓN MEDIANTE VALIDATE.JS
            // ==================================

            const valor = campoMonto.value.trim();

            const errores = validate(
                {
                    monto: valor
                },
                {
                    monto: {
                        presence: {
                            allowEmpty: false,
                            message: "^Ingresa el monto del depósito."
                        },
                        numericality: {
                            greaterThan: 0,
                            message: "^El monto debe ser mayor a $0.00."
                        },
                        format: {
                            pattern: /^\d+(\.\d{1,2})?$/,
                            message: "^Ingresa un monto con un máximo de dos decimales."
                        }
                    }
                }
            );

            if (errores) {

                await Swal.fire({
                    title: "Monto incorrecto",
                    text: errores.monto[0],
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#ffcc00"
                });

                campoMonto.focus();

                return;

            }

            const monto = Number(valor);

            if (
                !Number.isFinite(monto) ||
                !Number.isSafeInteger(Math.round(monto * 100))
            ) {

                await Swal.fire({
                    title: "Monto incorrecto",
                    text: "El monto ingresado no es válido.",
                    icon: "error",
                    confirmButtonColor: "#ffcc00"
                });

                return;

            }

            Transacciones.bloquearFormulario(formulario, true);

            // ==================================
            // 6. CONFIRMACIÓN INTERACTIVA
            // ==================================

            const confirmacion = await Swal.fire({

                title: "Confirmar depósito",

                text: "¿Deseas depositar " +
                      formatearMonto(monto) +
                      " en tu cuenta?",

                icon: "question",

                showCancelButton: true,

                confirmButtonText: "Confirmar depósito",
                cancelButtonText: "Cancelar",

                confirmButtonColor: "#ffcc00",
                cancelButtonColor: "#6c757d",

                reverseButtons: true

            });

            if (!confirmacion.isConfirmed) {
                return;
            }

            // ==================================
            // 7. EJECUTAR OPERACIÓN BANCARIA
            // ==================================

            const resultado = Banco.depositar(monto);

            if (!resultado || !resultado.exito) {

                const detalle = resultado && resultado.mensaje
                    ? resultado.mensaje
                    : "No fue posible realizar el depósito.";

                mostrarMensaje(detalle, "danger");

                await Swal.fire({
                    title: "Depósito rechazado",
                    text: detalle,
                    icon: "error",
                    confirmButtonColor: "#ffcc00"
                });

                return;

            }

            const saldoActual = Banco.obtenerSaldo();

            // ==================================
            // 8. MOSTRAR RESULTADO
            // ==================================

            mostrarMensaje(
                "Depósito exitoso. Monto: " +
                formatearMonto(monto) +
                ". Nuevo saldo: " +
                formatearMonto(saldoActual),
                "success"
            );

            formulario.reset();

            console.log(
                "Pokémon Bank - Depósito registrado:",
                monto.toFixed(2)
            );

            console.log(
                "Pokémon Bank - Nuevo saldo:",
                Number(saldoActual).toFixed(2)
            );

            // ==================================
            // 9. OFRECER COMPROBANTE PDF
            // ==================================

            const respuesta = await Swal.fire({

                title: "¡Depósito exitoso!",

                html:
                    "<strong>Monto depositado:</strong> " +
                    formatearMonto(monto) +
                    "<br>" +
                    "<strong>Nuevo saldo:</strong> " +
                    formatearMonto(saldoActual) +
                    "<br><br>" +
                    "¿Deseas descargar el comprobante PDF?",

                icon: "success",

                showCancelButton: true,

                confirmButtonText: "Descargar comprobante",
                cancelButtonText: "Finalizar",

                confirmButtonColor: "#ffcc00",
                cancelButtonColor: "#6c757d"

            });

            // ==================================
            // 10. GENERAR COMPROBANTE
            // ==================================

            if (respuesta.isConfirmed) {

                try {

                    if (
                        typeof Comprobantes === "undefined" ||
                        typeof Comprobantes.generar !== "function"
                    ) {
                        throw new Error("Módulo PDF no disponible.");
                    }

                    const generado = Comprobantes.generar(
                        "Deposito",
                        monto,
                        saldoActual,
                        "Deposito a cuenta"
                    );

                    if (generado === false) {
                        throw new Error("No se generó el comprobante.");
                    }

                } catch (errorPDF) {

                    console.error(
                        "Pokémon Bank - Error de comprobante:",
                        errorPDF
                    );

                    await Swal.fire({
                        title: "Comprobante no disponible",
                        text: "El depósito fue registrado correctamente, pero no fue posible generar el PDF.",
                        icon: "warning",
                        confirmButtonColor: "#ffcc00"
                    });

                }

            }

        } catch (error) {

            console.error(
                "Pokémon Bank - Error durante el depósito:",
                error
            );

            mostrarMensaje(
                "Ocurrió un error. Verifica el saldo y el historial antes de intentar nuevamente.",
                "danger"
            );

            await Swal.fire({
                title: "Error de procesamiento",
                text: "Verifica el saldo y el historial antes de repetir la operación.",
                icon: "error",
                confirmButtonColor: "#ffcc00"
            });

        } finally {

            procesando = false;

            Transacciones.bloquearFormulario(formulario, false);

        }

    });

});