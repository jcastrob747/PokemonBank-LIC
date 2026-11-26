/*
 * Pokémon Bank - Fase 2
 * Archivo: servicios.js
 *
 * Procesamiento de pagos de servicios.
 * Validación de servicio, referencia, monto y saldo.
 */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    // ==========================================
    // 1. ELEMENTOS DE LA INTERFAZ
    // ==========================================

    const formulario = document.getElementById("formServicios");
    const campoServicio = document.getElementById("servicio");
    const campoReferencia = document.getElementById("referencia");
    const campoMonto = document.getElementById("monto");
    const mensaje = document.getElementById("mensajeServicios");

    if (
        !formulario ||
        !campoServicio ||
        !campoReferencia ||
        !campoMonto ||
        !mensaje
    ) {
        console.error("Pokémon Bank - Formulario de servicios incompleto.");
        return;
    }

    let procesando = false;

    // ==========================================
    // 2. CATÁLOGO DE SERVICIOS
    // ==========================================

    const serviciosPermitidos = Object.freeze({

        electricidad: "Energía eléctrica",
        internet: "Internet",
        telefonia: "Telefonía",
        agua: "Agua potable"

    });

    // ==========================================
    // 3. FUNCIONES AUXILIARES
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
    // 4. INICIALIZACIÓN DEL MÓDULO
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
            "Pokémon Bank - Módulo de servicios de Fase 2 inicializado."
        );

    } catch (error) {

        console.error("Pokémon Bank - Error de inicialización:", error);

        mostrarMensaje(
            "No fue posible inicializar el módulo de servicios.",
            "danger"
        );

        formulario.querySelectorAll("input, select, button").forEach(
            function (elemento) {
                elemento.disabled = true;
            }
        );

        return;

    }

    // ==========================================
    // 5. PROCESAMIENTO DEL FORMULARIO
    // ==========================================

    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        if (procesando) {
            return;
        }

        procesando = true;

        limpiarMensaje();

        try {

            const servicio = campoServicio.value;
            const referencia = campoReferencia.value.trim();
            const valorMonto = campoMonto.value.trim();

            // ==================================
            // 6. VALIDACIÓN MEDIANTE VALIDATE.JS
            // ==================================

            const errores = validate(
                {
                    servicio: servicio,
                    referencia: referencia,
                    monto: valorMonto
                },
                {
                    servicio: {
                        presence: {
                            allowEmpty: false,
                            message: "^Selecciona un servicio."
                        },
                        inclusion: {
                            within: Object.keys(serviciosPermitidos),
                            message: "^El servicio seleccionado no es válido."
                        }
                    },

                    referencia: {
                        presence: {
                            allowEmpty: false,
                            message: "^Ingresa el número de referencia."
                        },
                        length: {
                            minimum: 1,
                            maximum: 20,
                            message: "^La referencia debe contener entre 1 y 20 caracteres."
                        },
                        format: {
                            pattern: /^[A-Za-z0-9-]+$/,
                            message: "^La referencia solamente puede contener letras, números y guiones."
                        }
                    },

                    monto: {
                        presence: {
                            allowEmpty: false,
                            message: "^Ingresa el monto del pago."
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

                const listaErrores = [];

                Object.keys(errores).forEach(function (campo) {

                    listaErrores.push(errores[campo][0]);

                });

                await Swal.fire({

                    title: "Datos incorrectos",

                    text: listaErrores.join(" "),

                    icon: "error",

                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#ffcc00"

                });

                return;

            }

            const monto = Number(valorMonto);

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

            const nombreServicio = serviciosPermitidos[servicio];

            // ==================================
            // 7. VERIFICAR FONDOS DISPONIBLES
            // ==================================

            const saldoDisponible = Banco.obtenerSaldo();

            if (monto > saldoDisponible) {

                mostrarMensaje(
                    "Saldo insuficiente para realizar el pago.",
                    "danger"
                );

                await Swal.fire({

                    title: "Saldo insuficiente",

                    text: "Tu saldo disponible es " +
                          formatearMonto(saldoDisponible) +
                          ".",

                    icon: "warning",

                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#ffcc00"

                });

                return;

            }

            Transacciones.bloquearFormulario(formulario, true);

            // ==================================
            // 8. CONFIRMACIÓN INTERACTIVA
            // ==================================

            const confirmacion = await Swal.fire({

                title: "Confirmar pago de servicio",

                html:
                    "<strong>Servicio:</strong> " +
                    Transacciones.escaparHTML(nombreServicio) +
                    "<br>" +
                    "<strong>Referencia:</strong> " +
                    Transacciones.escaparHTML(referencia) +
                    "<br>" +
                    "<strong>Monto:</strong> " +
                    formatearMonto(monto) +
                    "<br><br>" +
                    "¿Deseas confirmar esta operación?",

                icon: "question",

                showCancelButton: true,

                confirmButtonText: "Confirmar pago",
                cancelButtonText: "Cancelar",

                confirmButtonColor: "#ffcc00",
                cancelButtonColor: "#6c757d",

                reverseButtons: true

            });

            if (!confirmacion.isConfirmed) {
                return;
            }

            // ==================================
            // 9. EJECUTAR OPERACIÓN BANCARIA
            // ==================================

            const resultado = Banco.pagarServicio(
                servicio,
                referencia,
                monto
            );

            if (!resultado || !resultado.exito) {

                const detalle = resultado && resultado.mensaje
                    ? resultado.mensaje
                    : "No fue posible realizar el pago.";

                mostrarMensaje(detalle, "danger");

                await Swal.fire({
                    title: "Pago rechazado",
                    text: detalle,
                    icon: "error",
                    confirmButtonColor: "#ffcc00"
                });

                return;

            }

            const saldoActual = Banco.obtenerSaldo();

            // ==================================
            // 10. MOSTRAR RESULTADO
            // ==================================

            mostrarMensaje(
                "Pago exitoso de " +
                nombreServicio +
                ". Monto: " +
                formatearMonto(monto) +
                ". Nuevo saldo: " +
                formatearMonto(saldoActual),
                "success"
            );

            formulario.reset();

            console.log(
                "Pokémon Bank - Pago registrado:",
                nombreServicio,
                monto.toFixed(2)
            );

            console.log(
                "Pokémon Bank - Nuevo saldo:",
                Number(saldoActual).toFixed(2)
            );

            // ==================================
            // 11. OFRECER COMPROBANTE PDF
            // ==================================

            const respuesta = await Swal.fire({

                title: "¡Pago exitoso!",

                html:
                    "<strong>Servicio:</strong> " +
                    Transacciones.escaparHTML(nombreServicio) +
                    "<br>" +
                    "<strong>Referencia:</strong> " +
                    Transacciones.escaparHTML(referencia) +
                    "<br>" +
                    "<strong>Monto pagado:</strong> " +
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
            // 12. GENERAR COMPROBANTE
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
                        "Servicio",
                        monto,
                        saldoActual,
                        "Pago de " +
                        nombreServicio +
                        " - Ref: " +
                        referencia
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
                        text: "El pago fue registrado correctamente, pero no fue posible generar el PDF.",
                        icon: "warning",
                        confirmButtonColor: "#ffcc00"
                    });

                }

            }

        } catch (error) {

            console.error(
                "Pokémon Bank - Error durante el pago:",
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