/*
 * Pokémon Bank
 * Archivo: deposito.js
 *
 * Procesamiento de depósitos bancarios.
 *
 * Integración:
 * - SweetAlert2
 * - jsPDF mediante comprobantes.js
 *
 * Simulador bancario académico.
 */

document.addEventListener("DOMContentLoaded", function () {

    // ============================================
    // 1. OBTENER ELEMENTOS DEL FORMULARIO
    // ============================================

    const formulario = document.getElementById("formDeposito");

    const campoMonto = document.getElementById("montoDeposito");

    const mensaje = document.getElementById("mensajeDeposito");

    // Verificar elementos

    if (!formulario || !campoMonto || !mensaje) {

        console.error(
            "No se encontraron los elementos del formulario de depósito."
        );

        return;
    }

    // Evitar operaciones simultáneas
    let procesando = false;

    // ============================================
    // 2. PROCESAR DEPÓSITO
    // ============================================

    formulario.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        if (procesando) {
            return;
        }

        mensaje.innerHTML = "";

        const monto = Number(campoMonto.value);

        // ============================================
        // 3. VALIDAR MONTO
        // ============================================

        if (
            campoMonto.value.trim() === "" ||
            !Number.isFinite(monto) ||
            monto <= 0 ||
            !Number.isInteger(monto * 100)
        ) {

            if (typeof Swal === "function") {

                await Swal.fire({

                    title: "Monto incorrecto",

                    text: "Ingresa un monto válido mayor a $0.00, con un máximo de dos decimales.",

                    icon: "error",

                    confirmButtonText: "Aceptar",

                    confirmButtonColor: "#ffcc00"

                });

            } else {

                mensaje.innerHTML = `
                    <div class="alert alert-danger">
                        Ingresa un monto válido mayor a $0.00,
                        con un máximo de dos decimales.
                    </div>
                `;

            }

            return;
        }

        // ============================================
        // 4. CONFIRMAR OPERACIÓN
        // ============================================

        procesando = true;

        try {

            if (typeof Swal !== "function") {

                mensaje.innerHTML = `
                    <div class="alert alert-danger">
                        No se pudo cargar el módulo de confirmación.
                        Intenta nuevamente.
                    </div>
                `;

                return;
            }

            const confirmacion = await Swal.fire({

                title: "Confirmar depósito",

                html:
                    "¿Deseas depositar <strong>$" +
                    monto.toFixed(2) +
                    "</strong> en tu cuenta?",

                icon: "question",

                showCancelButton: true,

                confirmButtonText: "Sí, depositar",

                cancelButtonText: "Cancelar",

                confirmButtonColor: "#ffcc00",

                cancelButtonColor: "#6c757d",

                reverseButtons: true

            });

            if (!confirmacion.isConfirmed) {

                console.log(
                    "El usuario canceló el depósito."
                );

                return;
            }

            // ============================================
            // 5. EJECUTAR DEPÓSITO
            // ============================================

            const resultado = Banco.depositar(monto);

            if (!resultado.exito) {

                await Swal.fire({

                    title: "No se pudo realizar el depósito",

                    text: resultado.mensaje,

                    icon: "error",

                    confirmButtonText: "Aceptar",

                    confirmButtonColor: "#ffcc00"

                });

                return;
            }

            // ============================================
            // 6. MOSTRAR RESULTADO
            // ============================================

            mensaje.innerHTML = `
                <div class="alert alert-success">

                    <strong>Depósito exitoso.</strong>

                    <br>

                    Monto depositado:
                    $${monto.toFixed(2)}

                    <br>

                    Nuevo saldo:
                    $${resultado.saldo.toFixed(2)}

                </div>
            `;

            formulario.reset();

            console.log(
                "Depósito registrado correctamente."
            );

            console.log(
                "Nuevo saldo:",
                resultado.saldo.toFixed(2)
            );

            // ============================================
            // 7. OFRECER COMPROBANTE PDF
            // ============================================

            const respuesta = await Swal.fire({

                title: "¡Depósito exitoso!",

                html:
                    "<strong>Monto depositado:</strong> $" +
                    monto.toFixed(2) +
                    "<br>" +
                    "<strong>Nuevo saldo:</strong> $" +
                    resultado.saldo.toFixed(2) +
                    "<br><br>" +
                    "¿Deseas descargar el comprobante PDF?",

                icon: "success",

                showCancelButton: true,

                confirmButtonText: "Descargar comprobante",

                cancelButtonText: "Finalizar",

                confirmButtonColor: "#ffcc00",

                cancelButtonColor: "#6c757d"

            });

            // ============================================
            // 8. GENERAR COMPROBANTE
            // ============================================

            if (respuesta.isConfirmed) {

                if (
                    typeof Comprobantes !== "undefined" &&
                    typeof Comprobantes.generar === "function"
                ) {

                    const generado = Comprobantes.generar(

                        "Deposito",

                        monto,

                        resultado.saldo,

                        "Deposito a cuenta"

                    );

                    if (!generado) {

                        await Swal.fire({

                            title: "Comprobante no disponible",

                            text: "El depósito fue registrado, pero no se pudo generar el PDF.",

                            icon: "warning",

                            confirmButtonText: "Aceptar"

                        });

                    }

                } else {

                    await Swal.fire({

                        title: "Comprobante no disponible",

                        text: "El depósito fue registrado, pero el módulo PDF no está disponible.",

                        icon: "warning",

                        confirmButtonText: "Aceptar"

                    });

                }

            }

        } catch (error) {

            console.error(
                "Error durante el procesamiento del depósito:",
                error
            );

            mensaje.innerHTML = `
                <div class="alert alert-danger">
                    Ocurrió un error durante el procesamiento.
                    Verifica el saldo y el historial antes
                    de intentar nuevamente.
                </div>
            `;

        } finally {

            procesando = false;

        }

    });

});