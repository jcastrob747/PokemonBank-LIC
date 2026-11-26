/*
 * Pokémon Bank
 *
 * Archivo: historial.js
 *
 * Fase 2 - Historial de transacciones bancarias.
 *
 * Responsabilidades:
 *
 * - Recuperar información desde LocalStorage.
 * - Presentar información dinámica del usuario.
 * - Mostrar las transacciones registradas.
 * - Clasificar las operaciones bancarias.
 * - Presentar saldos anteriores y posteriores.
 * - Permitir descargar comprobantes PDF.
 * - Gestionar errores de recuperación.
 *
 * Lenguajes Interpretados en el Cliente
 * Proyecto académico.
 */

"use strict";

const Historial = {

    // ==========================================
    // 1. FORMATEAR MONTOS MONETARIOS
    // ==========================================

    formatearMonto: function (centavos) {

        if (!Number.isSafeInteger(centavos)) {

            throw new Error(
                "El monto monetario no es válido."
            );

        }

        return "$" + (centavos / 100).toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    },

    // ==========================================
    // 2. FORMATEAR FECHA
    // ==========================================

    formatearFecha: function (fecha) {

        const fechaOperacion = new Date(fecha);

        if (Number.isNaN(fechaOperacion.getTime())) {

            return "Fecha no disponible";

        }

        return fechaOperacion.toLocaleString(
            "es-SV",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    },

    // ==========================================
    // 3. CREAR CELDAS DE LA TABLA
    // ==========================================

    crearCelda: function (contenido, clase = "") {

        const celda = document.createElement("td");

        celda.textContent = String(contenido);

        if (clase) {

            celda.className = clase;

        }

        return celda;

    },

    // ==========================================
    // 4. CLASIFICAR OPERACIONES
    // ==========================================

    obtenerTipo: function (tipo) {

        switch (tipo) {

            case "Depósito":

                return {

                    nombre: "Depósito",

                    clase: "badge badge-success",

                    signo: "+",

                    claseMonto: "amount-positive"

                };

            case "Retiro":

                return {

                    nombre: "Retiro",

                    clase: "badge badge-danger",

                    signo: "-",

                    claseMonto: "amount-negative"

                };

            case "Servicio":

                return {

                    nombre: "Servicio",

                    clase: "badge badge-warning",

                    signo: "-",

                    claseMonto: "amount-negative"

                };

            default:

                throw new Error(
                    "Tipo de transacción no reconocido."
                );

        }

    },

    // ==========================================
    // 5. MOSTRAR NOTIFICACIONES
    // ==========================================

    notificar: function (titulo, mensaje, icono) {

        if (
            typeof Swal !== "undefined" &&
            typeof Swal.fire === "function"
        ) {

            return Swal.fire({

                title: titulo,

                text: mensaje,

                icon: icono,

                confirmButtonText: "Aceptar",

                confirmButtonColor: "#203783"

            });

        }

        console.error(titulo, mensaje);

        return Promise.resolve();

    },

    // ==========================================
    // 6. DESCARGAR COMPROBANTE
    // ==========================================

    descargarComprobante: async function (
        identificador,
        boton
    ) {

        boton.disabled = true;

        try {

            // Verificar sesión activa.

            if (
                typeof Sesion === "undefined" ||
                !Sesion.estaActiva()
            ) {

                throw new Error(
                    "La sesión bancaria no está activa."
                );

            }

            // Verificar disponibilidad de jsPDF.

            if (
                !window.jspdf ||
                !window.jspdf.jsPDF
            ) {

                throw new Error(
                    "La biblioteca jsPDF no está disponible."
                );

            }

            // Verificar módulo de comprobantes.

            if (
                typeof Comprobantes === "undefined" ||
                typeof Comprobantes.generarDesdeTransaccion !== "function"
            ) {

                throw new Error(
                    "El módulo de comprobantes no está disponible."
                );

            }

            // Recuperar y validar información bancaria.

            const datos = Banco.obtenerDatos();

            if (!Banco.validarDatos(datos)) {

                throw new Error(
                    "La información bancaria no es válida."
                );

            }

            // Verificar existencia de la transacción.

            const transaccion = Banco.obtenerHistorial().find(
                function (movimiento) {

                    return movimiento.id === identificador;

                }
            );

            if (!transaccion) {

                throw new Error(
                    "No se encontró la transacción solicitada."
                );

            }

            // Generar PDF desde el historial existente.
            // No se ejecuta una nueva operación bancaria.

            const generado = await Comprobantes.generarDesdeTransaccion(
                transaccion
            );

            if (generado !== true) {

                throw new Error(
                    "No fue posible generar el comprobante."
                );

            }

            console.log(
                "Pokémon Bank - Comprobante descargado:",
                identificador
            );

            await this.notificar(

                "Comprobante generado",

                "El comprobante PDF se generó correctamente.",

                "success"

            );

        } catch (error) {

            console.error(
                "Pokémon Bank - Error al descargar comprobante:",
                error
            );

            await this.notificar(

                "Comprobante no disponible",

                "No fue posible generar el comprobante solicitado.",

                "error"

            );

        } finally {

            boton.disabled = false;

        }

    },

    // ==========================================
    // 7. CREAR BOTÓN DE COMPROBANTE
    // ==========================================

    crearBotonComprobante: function (transaccion) {

        const celda = document.createElement("td");

        const boton = document.createElement("button");

        boton.type = "button";

        boton.className = "btn btn-primary btn-sm";

        boton.textContent = "Descargar PDF";

        boton.dataset.transaccionId = transaccion.id;

        boton.setAttribute(
            "aria-label",
            "Descargar comprobante de " + transaccion.tipo
        );

        boton.addEventListener(
            "click",
            function () {

                Historial.descargarComprobante(
                    transaccion.id,
                    boton
                );

            }
        );

        celda.appendChild(boton);

        return celda;

    },

    // ==========================================
    // 8. CREAR FILA DE TRANSACCIÓN
    // ==========================================

    crearFila: function (transaccion) {

        const fila = document.createElement("tr");

        fila.dataset.transaccionId = transaccion.id;

        // Clasificar la operación.

        const tipo = this.obtenerTipo(
            transaccion.tipo
        );

        // Fecha de la operación.

        fila.appendChild(

            this.crearCelda(
                this.formatearFecha(transaccion.fecha)
            )

        );

        // Identificador único.

        const celdaIdentificador = this.crearCelda(
            transaccion.id,
            "small"
        );

        celdaIdentificador.title = transaccion.id;

        fila.appendChild(celdaIdentificador);

        // Tipo de operación.

        const celdaTipo = document.createElement("td");

        const etiqueta = document.createElement("span");

        etiqueta.className = tipo.clase;

        etiqueta.textContent = tipo.nombre;

        celdaTipo.appendChild(etiqueta);

        fila.appendChild(celdaTipo);

        // Descripción.

        fila.appendChild(

            this.crearCelda(
                transaccion.descripcion
            )

        );

        // Saldo anterior.

        fila.appendChild(

            this.crearCelda(

                this.formatearMonto(
                    transaccion.saldoAnteriorCentavos
                ),

                "text-nowrap"

            )

        );

        // Monto de la operación.

        fila.appendChild(

            this.crearCelda(

                tipo.signo + this.formatearMonto(
                    transaccion.montoCentavos
                ),

                tipo.claseMonto + " text-nowrap"

            )

        );

        // Saldo posterior.

        fila.appendChild(

            this.crearCelda(

                this.formatearMonto(
                    transaccion.saldoPosteriorCentavos
                ),

                "font-weight-bold text-nowrap"

            )

        );

        // Comprobante PDF.

        fila.appendChild(

            this.crearBotonComprobante(
                transaccion
            )

        );

        return fila;

    },

    // ==========================================
    // 9. MOSTRAR INFORMACIÓN DEL USUARIO
    // ==========================================

    mostrarUsuario: function (usuario) {

        document.getElementById(
            "nombreUsuario"
        ).textContent = usuario.nombre;

        document.getElementById(
            "numeroCuenta"
        ).textContent = usuario.cuenta;

        document.getElementById(
            "tipoCuenta"
        ).textContent = usuario.tipoCuenta;

    },

    // ==========================================
    // 10. MOSTRAR RESUMEN DE TRANSACCIONES
    // ==========================================

    mostrarResumen: function (historial) {

        const resumen = {

            depositos: 0,

            retiros: 0,

            servicios: 0

        };

        historial.forEach(function (transaccion) {

            switch (transaccion.tipo) {

                case "Depósito":

                    resumen.depositos++;

                    break;

                case "Retiro":

                    resumen.retiros++;

                    break;

                case "Servicio":

                    resumen.servicios++;

                    break;

                default:

                    throw new Error(
                        "Se encontró una operación desconocida."
                    );

            }

        });

        document.getElementById(
            "totalTransacciones"
        ).textContent = historial.length;

        document.getElementById(
            "totalDepositos"
        ).textContent = resumen.depositos;

        document.getElementById(
            "totalRetiros"
        ).textContent = resumen.retiros;

        document.getElementById(
            "totalServicios"
        ).textContent = resumen.servicios;

        return resumen;

    },

    // ==========================================
    // 11. MOSTRAR HISTORIAL VACÍO
    // ==========================================

    mostrarHistorialVacio: function (tabla) {

        const fila = document.createElement("tr");

        const celda = document.createElement("td");

        celda.colSpan = 8;

        celda.className = "text-center text-muted p-4";

        celda.textContent =
            "No existen transacciones registradas.";

        fila.appendChild(celda);

        tabla.appendChild(fila);

    },

    // ==========================================
    // 12. MOSTRAR TRANSACCIONES
    // ==========================================

    mostrarTransacciones: function (historial) {

        const tabla = document.getElementById(
            "tablaHistorial"
        );

        tabla.textContent = "";

        // Verificar si existen movimientos.

        if (historial.length === 0) {

            this.mostrarHistorialVacio(tabla);

            return;

        }

        // Crear un fragmento para optimizar
        // la actualización del documento HTML.

        const fragmento =
            document.createDocumentFragment();

        // Mantener el orden original de las operaciones.

        historial.forEach(function (transaccion) {

            fragmento.appendChild(

                Historial.crearFila(transaccion)

            );

        });

        tabla.appendChild(fragmento);

    },

    // ==========================================
    // 13. MOSTRAR ERROR DE RECUPERACIÓN
    // ==========================================

    mostrarError: function () {

        const elementos = [

            "informacionCuenta",

            "resumenHistorial",

            "contenedorHistorial"

        ];

        elementos.forEach(function (id) {

            const elemento =
                document.getElementById(id);

            if (elemento) {

                elemento.classList.add("d-none");

            }

        });

        const tabla = document.getElementById(
            "tablaHistorial"
        );

        if (tabla) {

            tabla.textContent = "";

        }

        const mensaje = document.getElementById(
            "mensajeErrorHistorial"
        );

        if (mensaje) {

            mensaje.classList.remove("d-none");

        }

        this.notificar(

            "Historial no disponible",

            "No fue posible recuperar la información bancaria. Cierra sesión e intenta nuevamente.",

            "error"

        );

    },

    // ==========================================
    // 14. INICIALIZAR MÓDULO
    // ==========================================

    inicializar: function () {

        try {

            // Verificar los elementos requeridos.

            const elementosRequeridos = [

                "nombreUsuario",

                "numeroCuenta",

                "tipoCuenta",

                "totalTransacciones",

                "totalDepositos",

                "totalRetiros",

                "totalServicios",

                "tablaHistorial",

                "informacionCuenta",

                "resumenHistorial",

                "contenedorHistorial",

                "mensajeErrorHistorial"

            ];

            elementosRequeridos.forEach(function (id) {

                if (!document.getElementById(id)) {

                    throw new Error(
                        "Elemento HTML no encontrado: " + id
                    );

                }

            });

            // Verificar sesión.

            if (
                typeof Sesion === "undefined" ||
                !Sesion.estaActiva()
            ) {

                window.location.replace("index.html");

                return;

            }

            // Verificar disponibilidad del motor bancario.

            if (typeof Banco === "undefined") {

                throw new Error(
                    "El motor bancario no está disponible."
                );

            }

            // Inicializar motor bancario.

            if (!Banco.inicializar()) {

                throw new Error(
                    "No fue posible inicializar el motor bancario."
                );

            }

            // Recuperar información persistente.

            const datos = Banco.obtenerDatos();

            // Validar integridad de la información.

            if (!Banco.validarDatos(datos)) {

                throw new Error(
                    "La estructura bancaria no es válida."
                );

            }

            // Recuperar usuario e historial.

            const usuario = Banco.obtenerUsuario();

            const historial = Banco.obtenerHistorial();

            if (!Array.isArray(historial)) {

                throw new Error(
                    "El historial bancario no es válido."
                );

            }

            // Actualizar información de la cuenta.

            this.mostrarUsuario(usuario);

            // Actualizar resumen.

            const resumen = this.mostrarResumen(
                historial
            );

            // Presentar movimientos.

            this.mostrarTransacciones(historial);

            // Mostrar información validada.

            document.getElementById(
                "informacionCuenta"
            ).classList.remove("d-none");

            document.getElementById(
                "resumenHistorial"
            ).classList.remove("d-none");

            document.getElementById(
                "contenedorHistorial"
            ).classList.remove("d-none");

            document.getElementById(
                "mensajeErrorHistorial"
            ).classList.add("d-none");

            // Confirmar inicialización.

            console.log(
                "Pokémon Bank - Historial de Fase 2 inicializado."
            );

            console.log(
                "Total de transacciones:",
                historial.length
            );

            console.table(resumen);

        } catch (error) {

            console.error(
                "Pokémon Bank - Error durante la consulta del historial:",
                error
            );

            this.mostrarError();

        }

    }

};

// ==========================================
// 15. INICIALIZACIÓN DEL DOCUMENTO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        Historial.inicializar();

    }
);