/*
 * Pokémon Bank
 * Archivo: comprobantes.js
 *
 * Fase 2 - Generación de comprobantes bancarios en PDF.
 *
 * Biblioteca utilizada: jsPDF
 *
 * Desafío Práctico
 * Lenguajes Interpretados en el Cliente
 *
 * Responsabilidades:
 *
 * - Recuperar dinámicamente la información bancaria.
 * - Identificar la transacción registrada.
 * - Generar comprobantes de depósitos, retiros y servicios.
 * - Presentar información financiera consistente.
 * - Descargar comprobantes sin modificar los datos bancarios.
 */

const Comprobantes = {

    // ============================================
    // 1. FORMATEAR MONTOS MONETARIOS
    // ============================================

    formatearMonto: function (monto) {

        if (!Number.isFinite(monto)) {

            throw new Error(
                "El monto del comprobante no es válido."
            );

        }

        return "$" + monto.toFixed(2);

    },

    // ============================================
    // 2. FORMATEAR FECHA DE LA TRANSACCIÓN
    // ============================================

    formatearFecha: function (fecha) {

        const fechaTransaccion = new Date(fecha);

        if (Number.isNaN(fechaTransaccion.getTime())) {

            throw new Error(
                "La fecha de la transacción no es válida."
            );

        }

        return fechaTransaccion.toLocaleString("es-SV");

    },

    // ============================================
    // 3. RECUPERAR TRANSACCIÓN REGISTRADA
    // ============================================

    obtenerTransaccion: function (
        tipo,
        monto,
        saldo,
        descripcion,
        saldoAnterior = null
    ) {

        const historial = Banco.obtenerHistorial();

        if (!Array.isArray(historial)) {

            throw new Error(
                "No fue posible recuperar el historial."
            );

        }

        const montoCentavos = Math.round(monto * 100);

        const saldoCentavos = Math.round(saldo * 100);

        const normalizarTexto = function (valor) {

            return String(valor || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim()
                .toLowerCase();

        };

        // Buscar desde la transacción más reciente.

        const transaccion = historial
            .slice()
            .reverse()
            .find(function (registro) {

                const tipoCorrecto =
                    normalizarTexto(registro.tipo) ===
                    normalizarTexto(tipo);

                const montoCorrecto =
                    registro.montoCentavos === montoCentavos;

                const saldoCorrecto =
                    registro.saldoPosteriorCentavos ===
                    saldoCentavos;

                const descripcionCorrecta =
                    !descripcion ||
                    normalizarTexto(registro.descripcion) ===
                    normalizarTexto(descripcion);

                const saldoAnteriorCorrecto =
                    saldoAnterior === null ||
                    registro.saldoAnteriorCentavos ===
                    Math.round(saldoAnterior * 100);

                return (
                    tipoCorrecto &&
                    montoCorrecto &&
                    saldoCorrecto &&
                    descripcionCorrecta &&
                    saldoAnteriorCorrecto
                );

            });

        if (!transaccion) {

            throw new Error(
                "No se encontró la transacción registrada."
            );

        }

        return transaccion;

    },

    // ============================================
    // 4. GENERAR COMPROBANTE BANCARIO
    // ============================================

    generar: function (
        tipo,
        monto,
        saldo,
        descripcion,
        saldoAnterior = null
    ) {

        try {

            // ====================================
            // 4.1 VERIFICAR DEPENDENCIAS
            // ====================================

            if (!window.jspdf || !window.jspdf.jsPDF) {

                throw new Error(
                    "La biblioteca jsPDF no está disponible."
                );

            }

            if (typeof Banco === "undefined") {

                throw new Error(
                    "El motor bancario no está disponible."
                );

            }

            if (
                typeof Sesion === "undefined" ||
                !Sesion.estaActiva()
            ) {

                throw new Error(
                    "No existe una sesión bancaria activa."
                );

            }

            // ====================================
            // 4.2 VALIDAR INFORMACIÓN RECIBIDA
            // ====================================

            if (
                !tipo ||
                !Number.isFinite(monto) ||
                monto <= 0 ||
                !Number.isFinite(saldo) ||
                saldo < 0
            ) {

                throw new Error(
                    "Los datos del comprobante no son válidos."
                );

            }

            // ====================================
            // 4.3 RECUPERAR DATOS BANCARIOS
            // ====================================

            const datos = Banco.obtenerDatos();

            if (!Banco.validarDatos(datos)) {

                throw new Error(
                    "La información bancaria no es válida."
                );

            }

            const usuario = Banco.obtenerUsuario();

            if (
                !usuario ||
                !usuario.nombre ||
                !usuario.cuenta ||
                !usuario.tipoCuenta
            ) {

                throw new Error(
                    "La información del titular está incompleta."
                );

            }

            // ====================================
            // 4.4 RECUPERAR TRANSACCIÓN REAL
            // ====================================

            const transaccion = this.obtenerTransaccion(
                tipo,
                monto,
                saldo,
                descripcion,
                saldoAnterior
            );

            // Generar el PDF exclusivamente con los datos
            // de la transacción previamente registrada.

            return this.generarDesdeTransaccion(
                transaccion
            );

        } catch (error) {

            console.error(
                "Pokémon Bank - Error al generar comprobante:",
                error
            );

            return false;

        }

    },

    // ============================================
    // 5. GENERAR PDF DESDE UNA TRANSACCIÓN
    // ============================================

    generarDesdeTransaccion: function (transaccion) {

        try {

            // ====================================
            // 5.1 VALIDAR DEPENDENCIAS Y SESIÓN
            // ====================================

            if (!window.jspdf || !window.jspdf.jsPDF) {

                throw new Error(
                    "La biblioteca jsPDF no está disponible."
                );

            }

            if (
                typeof Banco === "undefined" ||
                typeof Sesion === "undefined" ||
                !Sesion.estaActiva()
            ) {

                throw new Error(
                    "No existe una sesión bancaria válida."
                );

            }

            if (!Banco.validarDatos(Banco.obtenerDatos())) {

                throw new Error(
                    "Los datos bancarios no son válidos."
                );

            }

            if (!transaccion || !transaccion.id) {

                throw new Error(
                    "La transacción no es válida."
                );

            }

            // Recuperar la versión almacenada de la
            // transacción para garantizar consistencia.

            const registro = Banco.obtenerHistorial()
                .find(function (elemento) {

                    return elemento.id === transaccion.id;

                });

            if (!registro) {

                throw new Error(
                    "La transacción no existe en el historial."
                );

            }

            const usuario = Banco.obtenerUsuario();

            if (
                !usuario ||
                !usuario.nombre ||
                !usuario.cuenta ||
                !usuario.tipoCuenta ||
                registro.cuenta !== usuario.cuenta
            ) {

                throw new Error(
                    "La información de la cuenta no es válida."
                );

            }

            // ====================================
            // 5.2 RECUPERAR INFORMACIÓN FINANCIERA
            // ====================================

            if (
                !Number.isSafeInteger(registro.montoCentavos) ||
                registro.montoCentavos <= 0 ||
                !Number.isSafeInteger(
                    registro.saldoAnteriorCentavos
                ) ||
                registro.saldoAnteriorCentavos < 0 ||
                !Number.isSafeInteger(
                    registro.saldoPosteriorCentavos
                ) ||
                registro.saldoPosteriorCentavos < 0
            ) {

                throw new Error(
                    "Los valores financieros no son válidos."
                );

            }

            const monto =
                registro.montoCentavos / 100;

            const saldoAnterior =
                registro.saldoAnteriorCentavos / 100;

            const saldoPosterior =
                registro.saldoPosteriorCentavos / 100;

            const numeroComprobante =
                String(registro.id);

            const fecha =
                this.formatearFecha(registro.fecha);

            const { jsPDF } = window.jspdf;

            const documento = new jsPDF({

                orientation: "portrait",
                unit: "mm",
                format: "a4"

            });

            // ====================================
            // 5.3 ENCABEZADO
            // ====================================

            documento.setFillColor(36, 65, 145);

            documento.rect(
                0,
                0,
                210,
                45,
                "F"
            );

            documento.setTextColor(255, 255, 255);

            documento.setFontSize(22);

            documento.setFont(
                "helvetica",
                "bold"
            );

            documento.text(
                "POKÉMON BANK",
                105,
                20,
                { align: "center" }
            );

            documento.setFontSize(11);

            documento.setFont(
                "helvetica",
                "normal"
            );

            documento.text(
                "Simulador Bancario Académico",
                105,
                30,
                { align: "center" }
            );

            // ====================================
            // 5.4 TÍTULO DEL DOCUMENTO
            // ====================================

            documento.setTextColor(23, 63, 155);

            documento.setFontSize(16);

            documento.setFont(
                "helvetica",
                "bold"
            );

            documento.text(
                "COMPROBANTE DE TRANSACCIÓN",
                105,
                60,
                { align: "center" }
            );

            // ====================================
            // 5.5 INFORMACIÓN GENERAL
            // ====================================

            documento.setTextColor(0, 0, 0);

            documento.setFontSize(10);

            documento.setFont(
                "helvetica",
                "normal"
            );

            documento.text(
                "Comprobante No.: " + numeroComprobante,
                20,
                78
            );

            documento.setFontSize(11);

            documento.text(
                "Fecha: " + fecha,
                20,
                88
            );

            documento.setDrawColor(0, 0, 0);

            documento.line(
                20,
                98,
                190,
                98
            );

            // ====================================
            // 5.6 INFORMACIÓN DINÁMICA DE LA CUENTA
            // ====================================

            documento.setFont(
                "helvetica",
                "bold"
            );

            documento.text(
                "INFORMACIÓN DE LA CUENTA",
                20,
                110
            );

            documento.setFont(
                "helvetica",
                "normal"
            );

            documento.text(
                "Titular: " + usuario.nombre,
                20,
                122
            );

            documento.text(
                "Número de cuenta: " + registro.cuenta,
                20,
                132
            );

            documento.text(
                "Tipo de cuenta: " + usuario.tipoCuenta,
                20,
                142
            );

            documento.line(
                20,
                152,
                190,
                152
            );

            // ====================================
            // 5.7 DETALLES DE LA OPERACIÓN
            // ====================================

            documento.setFont(
                "helvetica",
                "bold"
            );

            documento.text(
                "DETALLES DE LA OPERACIÓN",
                20,
                164
            );

            documento.setFont(
                "helvetica",
                "normal"
            );

            documento.text(
                "Tipo: " + registro.tipo,
                20,
                176
            );

            const descripcionLineas =
                documento.splitTextToSize(

                    "Descripción: " +
                    String(
                        registro.descripcion ||
                        registro.tipo
                    ),

                    170

                );

            let posicion = 186;

            // Permitir descripciones extensas sin
            // superponer el contenido con el pie de página.

            descripcionLineas.forEach(function (linea) {

                if (posicion > 235) {

                    documento.addPage();

                    posicion = 25;

                }

                documento.text(
                    linea,
                    20,
                    posicion
                );

                posicion += 6;

            });

            posicion += 5;

            // ====================================
            // 5.8 INFORMACIÓN FINANCIERA
            // ====================================

            if (posicion + 30 > 240) {

                documento.addPage();

                posicion = 25;

            }

            documento.text(

                "Saldo anterior: " +
                this.formatearMonto(saldoAnterior),

                20,
                posicion

            );

            posicion += 10;

            documento.text(

                "Monto de la operación: " +
                this.formatearMonto(monto),

                20,
                posicion

            );

            posicion += 12;

            documento.setFont(
                "helvetica",
                "bold"
            );

            documento.setTextColor(23, 63, 155);

            documento.text(

                "Saldo resultante: " +
                this.formatearMonto(saldoPosterior),

                20,
                posicion

            );

            // ====================================
            // 5.9 AVISO ACADÉMICO
            // ====================================

            documento.setDrawColor(255, 204, 0);

            documento.line(
                20,
                250,
                190,
                250
            );

            documento.setFontSize(9);

            documento.setFont(
                "helvetica",
                "normal"
            );

            documento.setTextColor(100, 100, 100);

            documento.text(

                "Este documento corresponde a una",

                105,
                263,
                { align: "center" }

            );

            documento.text(

                "transacción simulada con fines académicos.",

                105,
                270,
                { align: "center" }

            );

            documento.text(

                "No representa una operación bancaria real.",

                105,
                277,
                { align: "center" }

            );

            // ====================================
            // 5.10 CONSTRUIR NOMBRE DEL ARCHIVO
            // ====================================

            const tipoArchivo = String(registro.tipo)

                .normalize("NFD")

                .replace(/[\u0300-\u036f]/g, "")

                .replace(/[^a-zA-Z0-9_-]/g, "_");

            const identificadorArchivo =
                numeroComprobante.replace(
                    /[^a-zA-Z0-9_-]/g,
                    "_"
                );

            const nombreArchivo =

                "Pokemon_Bank_" +

                tipoArchivo +

                "_" +

                identificadorArchivo +

                ".pdf";

            // ====================================
            // 5.11 DESCARGAR COMPROBANTE
            // ====================================

            documento.save(nombreArchivo);

            console.log(

                "Pokémon Bank - Comprobante generado:",

                nombreArchivo

            );

            return true;

        } catch (error) {

            console.error(

                "Pokémon Bank - Error al generar PDF:",

                error

            );

            return false;

        }

    }

};

// ============================================
// 6. CONFIRMACIÓN DE CARGA DEL MÓDULO
// ============================================

console.log(
    "Pokémon Bank - Módulo de comprobantes de Fase 2 cargado."
);