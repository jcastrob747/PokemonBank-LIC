/*
 * Pokémon Bank
 * Archivo: retiro.js
 *
 * Procesamiento de retiros bancarios.
 *
 * Integración:
 * - SweetAlert2
 * - jsPDF mediante comprobantes.js
 *
 * Simulador bancario académico.
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
            "No se encontraron los elementos del formulario de retiro."
        );

        return;
    }

    // ==========================================
    // 3. VERIFICAR MODULOS
    // ==========================================

    if (
        typeof Banco === "undefined" ||
        typeof Banco.retirar !== "function"
    ) {

        console.error(
            "El módulo bancario no está disponible."
        );

        return;
    }

    // Evitar operaciones simultáneas
    let procesando = false;

    // ==========================================
    // 4. PROCESAR FORMULARIO
    // ==========================================

    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        if (procesando) {
            return;
        }

        // ======================================
        // 5. OBTENER MONTO
        // ======================================

        const monto = Number(campoMonto.value);

        // ======================================
        // 6. VALIDAR MONTO
        // ======================================

        if (
            campoMonto.value.trim() === "" ||
            !Number.isFinite(monto) ||
            monto <= 0
        ) {

            await Swal.fire({

                title: "Monto incorrecto",

                text: "Ingresa un monto válido mayor a $0.00.",

                icon: "error",

                confirmButtonText: "Aceptar",

                confirmButtonColor: "#ffcc00"

            });

            campoMonto.focus();

            return;
        }

        // Validar máximo dos decimales

        if (
            Math.abs(
                monto * 100 - Math.round(monto * 100)
            ) > 0.000001
        ) {

            await Swal.fire({

                title: "Monto incorrecto",

                text: "El monto debe contener como máximo dos decimales.",

                icon: "error",

                confirmButtonText: "Aceptar",

                confirmButtonColor: "#ffcc00"

            });

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

            await Swal.fire({

                title: "Saldo insuficiente",

                html:
                    "No tienes fondos suficientes para realizar este retiro." +
                    "<br><br>" +
                    "<strong>Saldo disponible:</strong> $" +
                    saldoDisponible.toFixed(2),

                icon: "warning",

                confirmButtonText: "Aceptar",

                confirmButtonColor: "#ffcc00"

            });

            campoMonto.focus();

            return;
        }

        // ======================================
        // 9. CONFIRMAR OPERACION
        // ======================================

        procesando = true;

        let retiroRegistrado = false;

        try {

            if (typeof Swal !== "function") {
                console.error("SweetAlert2 no está disponible.");
                return;
            }

            const confirmacion = await Swal.fire({

                title: "Confirmar retiro",

                html:
                    "¿Deseas retirar <strong>$" +
                    monto.toFixed(2) +
                    "</strong> de tu cuenta?" +
                    "<br><br>" +
                    "<strong>Saldo actual:</strong> $" +
                    saldoDisponible.toFixed(2),

                icon: "question",

                showCancelButton: true,

                confirmButtonText: "Sí, retirar",

                cancelButtonText: "Cancelar",

                confirmButtonColor: "#ffcc00",

                cancelButtonColor: "#6c757d",

                reverseButtons: true

            });

            if (!confirmacion.isConfirmed) {

                console.log(
                    "El usuario canceló el retiro."
                );

                return;
            }

            // ==================================
            // 10. REALIZAR RETIRO
            // ==================================

            const resultado = Banco.retirar(monto);

            // ==================================
            // 11. VERIFICAR RESULTADO
            // ==================================

            if (!resultado.exito) {

                await Swal.fire({

                    title: "No se pudo realizar el retiro",

                    text:
                        resultado.mensaje ||
                        "Ocurrió un error durante la operación.",

                    icon: "error",

                    confirmButtonText: "Aceptar",

                    confirmButtonColor: "#ffcc00"

                });

                return;
            }

            retiroRegistrado = true;

            const nuevoSaldo = resultado.saldo;

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

            formulario.reset();

            // ==================================
            // 13. CONFIRMACION Y COMPROBANTE
            // ==================================

            const respuesta = await Swal.fire({

                title: "¡Retiro exitoso!",

                html:
                    "<strong>Monto retirado:</strong> $" +
                    monto.toFixed(2) +
                    "<br>" +
                    "<strong>Nuevo saldo:</strong> $" +
                    nuevoSaldo.toFixed(2) +
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
            // 14. GENERAR COMPROBANTE PDF
            // ==================================

            if (respuesta.isConfirmed) {

                if (
                    typeof Comprobantes !== "undefined" &&
                    typeof Comprobantes.generar === "function"
                ) {

                    const generado = Comprobantes.generar(

                        "Retiro",

                        monto,

                        nuevoSaldo,

                        "Retiro de efectivo"

                    );

                    if (!generado) {

                        await Swal.fire({

                            title: "Comprobante no disponible",

                            text:
                                "El retiro fue registrado correctamente, " +
                                "pero no se pudo generar el PDF.",

                            icon: "warning",

                            confirmButtonText: "Aceptar"

                        });

                    }

                } else {

                    await Swal.fire({

                        title: "Comprobante no disponible",

                        text:
                            "El retiro fue registrado, pero el módulo " +
                            "de comprobantes no está disponible.",

                        icon: "warning",

                        confirmButtonText: "Aceptar"

                    });

                }

            }

            // ==================================
            // 15. REGRESAR AL DASHBOARD
            // ==================================

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(
                "Error durante el procesamiento del retiro:",
                error
            );

            if (retiroRegistrado) {

                alert(
                    "El retiro fue registrado, pero ocurrió un error " +
                    "al mostrar la confirmación o generar el comprobante. " +
                    "Verifica el historial antes de intentar nuevamente."
                );

                window.location.href = "dashboard.html";

            } else {

                alert(
                    "No se pudo completar el proceso. " +
                    "Verifica el saldo y el historial antes de reintentar."
                );

            }

        } finally {

            procesando = false;

        }

    });

    // ==========================================
    // 16. CONFIRMAR CARGA DEL MODULO
    // ==========================================

    console.log(
        "Pokémon Bank - Módulo de retiros cargado correctamente."
    );

});