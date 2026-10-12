/*
 * Pokémon Bank
 * Archivo: servicios.js
 *
 * Administración de pagos de servicios.
 *
 * Bibliotecas:
 * - SweetAlert2
 * - jsPDF (mediante comprobantes.js)
 *
 * Simulador bancario académico.
 * Lenguajes Interpretados en el Cliente.
 */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    // ==========================================
    // 1. OBTENER ELEMENTOS DEL FORMULARIO
    // ==========================================

    const formulario =
        document.getElementById("formServicios");

    const campoServicio =
        document.getElementById("servicio");

    const campoReferencia =
        document.getElementById("referencia");

    const campoMonto =
        document.getElementById("monto");


    // ==========================================
    // 2. VERIFICAR ELEMENTOS
    // ==========================================

    if (
        !formulario ||
        !campoServicio ||
        !campoReferencia ||
        !campoMonto
    ) {

        console.error(
            "Error: No se encontraron los elementos del formulario."
        );

        return;
    }


    // ==========================================
    // 3. VERIFICAR MODULOS
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


    if (typeof Swal === "undefined") {

        console.error(
            "Error: SweetAlert2 no está disponible."
        );

        alert(
            "No fue posible cargar el módulo de notificaciones."
        );

        return;
    }


    // ==========================================
    // 4. CONTROL DE OPERACIONES
    // ==========================================

    let procesandoPago = false;
    
    // Convertir texto a contenido HTML seguro
function escaparHTML(valor) {

    return String(valor).replace(
        /[&<>"']/g,
        function (caracter) {

            const entidades = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entidades[caracter];

        }
    );

}


    // ==========================================
    // 5. MOSTRAR ERRORES
    // ==========================================

    async function mostrarError(mensaje) {

        await Swal.fire({

            icon: "error",

            title: "Operación no válida",

            text: mensaje,

            confirmButtonText: "Aceptar",

            confirmButtonColor: "#ffcc00"

        });

    }


    // ==========================================
    // 6. PROCESAR FORMULARIO
    // ==========================================

    formulario.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            // Evitar operaciones duplicadas
            if (procesandoPago) {

                return;
            }


            // ==================================
            // 7. OBTENER DATOS
            // ==================================

            const servicio =
                campoServicio.value;

            const referencia =
                campoReferencia.value.trim();

            const monto =
                Number(campoMonto.value);


            // ==================================
            // 8. VALIDAR SERVICIO
            // ==================================

            if (!servicio) {

                await mostrarError(
                    "Selecciona el servicio que deseas pagar."
                );

                campoServicio.focus();

                return;
            }


            // ==================================
            // 9. VALIDAR REFERENCIA
            // ==================================

            if (referencia === "") {

                await mostrarError(
                    "Ingresa el número de referencia o factura."
                );

                campoReferencia.focus();

                return;
            }


            // ==================================
            // 10. VALIDAR MONTO
            // ==================================

            if (
                !Number.isFinite(monto) ||
                monto <= 0
            ) {

                await mostrarError(
                    "Ingresa un monto válido mayor a $0.00."
                );

                campoMonto.focus();

                return;
            }


            // Validar máximo dos decimales

            if (
                Math.abs(
                    monto * 100 -
                    Math.round(monto * 100)
                ) > 0.000001
            ) {

                await mostrarError(
                    "El monto debe contener como máximo dos decimales."
                );

                campoMonto.focus();

                return;
            }


            // ==================================
            // 11. OBTENER NOMBRE DEL SERVICIO
            // ==================================

            const nombreServicio =
                campoServicio.options[
                    campoServicio.selectedIndex
                ].text;

// Proteger los datos que se mostrarán en SweetAlert2
const servicioSeguro = escaparHTML(nombreServicio);

const referenciaSegura = escaparHTML(referencia);

            // ==================================
            // 12. CONSULTAR SALDO
            // ==================================

            const saldoAnterior =
                Banco.obtenerSaldo();


            // ==================================
            // 13. VALIDAR FONDOS
            // ==================================

            if (monto > saldoAnterior) {

                await mostrarError(
                    "Saldo insuficiente. " +
                    "Saldo disponible: $" +
                    saldoAnterior.toFixed(2)
                );

                campoMonto.focus();

                return;
            }


            // ==================================
            // 14. CONFIRMAR PAGO
            // ==================================

            procesandoPago = true;

            try {

                const confirmacion = await Swal.fire({

                    title: "Confirmar pago",

                    icon: "question",

                    html:
    "<strong>Servicio:</strong> " +
    servicioSeguro +
    "<br>" +

    "<strong>Referencia:</strong> " +
    referenciaSegura +
    "<br>" +

                        "<strong>Monto:</strong> $" +
                        monto.toFixed(2) +
                        "<br>" +

                        "<strong>Saldo actual:</strong> $" +
                        saldoAnterior.toFixed(2),

                    showCancelButton: true,

                    confirmButtonText: "Confirmar pago",

                    cancelButtonText: "Cancelar",

                    confirmButtonColor: "#ffcc00",

                    cancelButtonColor: "#6c757d"

                });


                if (!confirmacion.isConfirmed) {

                    console.log(
                        "El usuario canceló el pago."
                    );

                    return;
                }


                // ==============================
                // 15. PROCESAR PAGO
                // ==============================

                const resultado =
                    Banco.pagarServicio(
                        nombreServicio,
                        referencia,
                        monto
                    );


                // ==============================
                // 16. VERIFICAR RESULTADO
                // ==============================

                if (!resultado.exito) {

                    await mostrarError(
                        resultado.mensaje ||
                        "No fue posible realizar el pago."
                    );

                    console.error(
                        "Error al procesar pago:",
                        resultado
                    );

                    return;
                }


                // ==============================
                // 17. OBTENER NUEVO SALDO
                // ==============================

                const nuevoSaldo =
                    Banco.obtenerSaldo();


                // ==============================
                // 18. REGISTRAR EN CONSOLA
                // ==============================

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
                    "Saldo anterior:",
                    saldoAnterior.toFixed(2)
                );

                console.log(
                    "Nuevo saldo:",
                    nuevoSaldo.toFixed(2)
                );


                // ==============================
                // 19. MOSTRAR RESULTADO
                // ==============================

                const resultadoVisual =
                    await Swal.fire({

                        icon: "success",

                        title: "¡Pago exitoso!",

html:
    "<strong>Servicio:</strong> " +
    servicioSeguro +
    "<br>" +

    "<strong>Referencia:</strong> " +
    referenciaSegura +
    "<br><br>" +

                            "<strong>Monto pagado:</strong> $" +
                            monto.toFixed(2) +
                            "<br>" +

                            "<strong>Nuevo saldo:</strong> $" +
                            nuevoSaldo.toFixed(2) +
                            "<br><br>" +

                            "¿Deseas descargar el comprobante PDF?",

                        showCancelButton: true,

                        confirmButtonText:
                            "Descargar comprobante",

                        cancelButtonText:
                            "Finalizar",

                        confirmButtonColor:
                            "#ffcc00",

                        cancelButtonColor:
                            "#6c757d",

                        allowOutsideClick: false

                    });


                // ==============================
                // 20. GENERAR COMPROBANTE
                // ==============================

                if (resultadoVisual.isConfirmed) {

                    if (
                        typeof Comprobantes !== "undefined" &&
                        typeof Comprobantes.generar === "function"
                    ) {

                        const descripcion =
                            "Pago de " +
                            nombreServicio +
                            " - Ref: " +
                            referencia;


                        const generado =
                            Comprobantes.generar(

                                "Servicio",

                                monto,

                                nuevoSaldo,

                                descripcion,

                                saldoAnterior

                            );


                        if (!generado) {

                            await Swal.fire({

                                icon: "warning",

                                title:
                                    "Comprobante no disponible",

                                text:
                                    "El pago fue registrado " +
                                    "correctamente, pero no se " +
                                    "pudo generar el PDF.",

                                confirmButtonText:
                                    "Aceptar"

                            });

                        }

                    } else {

                        console.error(
                            "El módulo de comprobantes no está disponible."
                        );

                        await Swal.fire({

                            icon: "warning",

                            title:
                                "Comprobante no disponible",

                            text:
                                "El pago fue registrado " +
                                "correctamente, pero el módulo " +
                                "de comprobantes no está disponible.",

                            confirmButtonText:
                                "Aceptar"

                        });

                    }

                }


                // ==============================
                // 21. REGRESAR AL DASHBOARD
                // ==============================

                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Error durante el procesamiento del pago:",
                    error
                );

                await Swal.fire({

                    icon: "error",

                    title: "Error del sistema",

                    text:
                        "Ocurrió un error durante el proceso. " +
                        "Consulta el historial antes de " +
                        "intentar nuevamente.",

                    confirmButtonText: "Aceptar"

                });

            } finally {

                procesandoPago = false;

            }

        }
    );


    // ==========================================
    // 22. CONFIRMAR CARGA DEL MODULO
    // ==========================================

    console.log(
        "Pokémon Bank - Módulo de servicios cargado correctamente."
    );

});