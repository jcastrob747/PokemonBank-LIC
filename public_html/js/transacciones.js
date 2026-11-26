/*
 * ==================================================
 * POKÉMON BANK - FASE 2
 * Archivo: transacciones.js
 *
 * Funciones compartidas para los módulos de:
 * - Depósitos
 * - Retiros
 * - Pagos de servicios
 *
 * Lenguajes Interpretados en el Cliente
 * Simulador bancario académico.
 * ==================================================
 */

"use strict";

const Transacciones = {

    // ==============================================
    // 1. CONFIGURACIÓN VISUAL
    // ==============================================

    colorPrincipal: "#203A8A",

    colorSecundario: "#6c757d",

    // ==============================================
    // 2. CARGAR INFORMACIÓN BANCARIA
    // ==============================================

    cargarUsuario: function () {

        if (
            typeof Banco === "undefined" ||
            typeof Sesion === "undefined" ||
            !Sesion.estaActiva()
        ) {

            throw new Error(
                "El sistema bancario o la sesión no están disponibles."
            );

        }

        if (!Banco.inicializar()) {

            throw new Error(
                "No fue posible inicializar el motor bancario."
            );

        }

        const usuario = Banco.obtenerUsuario();

        const nombre =
            document.getElementById("nombreUsuario");

        const cuenta =
            document.getElementById("numeroCuenta");

        const tipoCuenta =
            document.getElementById("tipoCuenta");

        if (!usuario || !nombre || !cuenta || !tipoCuenta) {

            throw new Error(
                "No fue posible recuperar la información de la cuenta."
            );

        }

        nombre.textContent = usuario.nombre;

        cuenta.textContent = usuario.cuenta;

        tipoCuenta.textContent = usuario.tipoCuenta;

        return usuario;

    },

    // ==============================================
    // 3. VALIDAR MONTO MONETARIO
    // ==============================================

    validarMonto: function (valor) {

        const texto = String(valor).trim();

        // Validar formato decimal sin notación científica.

        if (!/^\d+(?:\.\d{1,2})?$/.test(texto)) {

            return {
                valido: false,
                mensaje:
                    "Ingresa un monto válido con un máximo de dos decimales."
            };

        }

        const monto = Number(texto);

        const centavos = Math.round(monto * 100);

        if (
            !Number.isFinite(monto) ||
            !Number.isSafeInteger(centavos) ||
            centavos <= 0
        ) {

            return {
                valido: false,
                mensaje:
                    "Ingresa un monto válido mayor a $0.00."
            };

        }

        // Validación adicional mediante Validate.js.

        if (typeof validate === "function") {

            const errores = validate(
                {
                    monto: monto
                },
                {
                    monto: {
                        presence: true,
                        numericality: {
                            greaterThan: 0
                        }
                    }
                }
            );

            if (errores) {

                return {
                    valido: false,
                    mensaje:
                        "El monto ingresado no es válido."
                };

            }

        }

        return {
            valido: true,
            monto: monto,
            centavos: centavos
        };

    },

    // ==============================================
    // 4. VALIDAR REFERENCIA DE SERVICIO
    // ==============================================

    validarReferencia: function (valor) {

        const referencia = String(valor).trim();

        if (
            referencia.length === 0 ||
            referencia.length > 20
        ) {

            return {
                valido: false,
                mensaje:
                    "Ingresa una referencia válida de 1 a 20 caracteres."
            };

        }

        if (typeof validate === "function") {

            const errores = validate(
                {
                    referencia: referencia
                },
                {
                    referencia: {
                        presence: {
                            allowEmpty: false
                        },
                        length: {
                            minimum: 1,
                            maximum: 20
                        }
                    }
                }
            );

            if (errores) {

                return {
                    valido: false,
                    mensaje:
                        "La referencia ingresada no es válida."
                };

            }

        }

        return {
            valido: true,
            referencia: referencia
        };

    },

    // ==============================================
    // 5. FORMATEAR CANTIDADES MONETARIAS
    // ==============================================

    formatearMonto: function (monto) {

        return "$" + Number(monto).toFixed(2);

    },

    // ==============================================
    // 6. PROTEGER CONTENIDO HTML
    // ==============================================

    escaparHTML: function (valor) {

        const entidades = {

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"

        };

        return String(valor).replace(
            /[&<>"']/g,
            caracter => entidades[caracter]
        );

    },

    // ==============================================
    // 7. MOSTRAR NOTIFICACIONES
    // ==============================================

    notificar: async function (titulo, mensaje, icono) {

        if (
            typeof Swal !== "undefined" &&
            typeof Swal.fire === "function"
        ) {

            return Swal.fire({

                title: titulo,

                text: mensaje,

                icon: icono,

                confirmButtonText: "Aceptar",

                confirmButtonColor:
                    this.colorPrincipal

            });

        }

        // Alternativa visual si SweetAlert2 no está
        // disponible. No utiliza alert() tradicional.

        const contenedor =
            document.querySelector("main") ||
            document.body;

        let aviso =
            document.getElementById("avisoTransaccion");

        if (!aviso) {

            aviso = document.createElement("div");

            aviso.id = "avisoTransaccion";

            aviso.setAttribute("role", "alert");

            contenedor.prepend(aviso);

        }

        aviso.className =
            icono === "success"
                ? "alert alert-success"
                : "alert alert-danger";

        aviso.textContent = titulo + ": " + mensaje;

        return {
            isConfirmed: false
        };

    },

    // ==============================================
    // 8. BLOQUEAR FORMULARIO
    // ==============================================

    bloquearFormulario: function (formulario, bloquear) {

        formulario.querySelectorAll(
            "input, select, button"
        ).forEach(function (elemento) {

            elemento.disabled = bloquear;

        });

    }

};

console.log(
    "Pokémon Bank - Funciones compartidas de transacciones cargadas."
);