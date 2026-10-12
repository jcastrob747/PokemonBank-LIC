/*
 * Pokémon Bank
 * Archivo: comprobantes.js
 *
 * Generación de comprobantes bancarios en PDF.
 *
 * Biblioteca utilizada: jsPDF
 *
 * Desafío Práctico
 * Lenguajes Interpretados en el Cliente
 */

const Comprobantes = {

    // Información de la cuenta
    titular: "Jose C.",
    numeroCuenta: "1002003001",
    tipoCuenta: "Cuenta de ahorros",

    // Generar comprobante bancario
generar: function (
    tipo,
    monto,
    saldo,
    descripcion,
    saldoAnterior = null
) {

        // Verificar disponibilidad de jsPDF
        if (!window.jspdf || !window.jspdf.jsPDF) {

            console.error(
                "La biblioteca jsPDF no está disponible."
            );

            return false;
        }

        // Validar información recibida
        if (
            !tipo ||
            !Number.isFinite(monto) ||
            monto <= 0 ||
            !Number.isFinite(saldo) ||
            saldo < 0
        ) {

            console.error(
                "Los datos del comprobante no son válidos."
            );

            return false;
        }

        const { jsPDF } = window.jspdf;

        const documento = new jsPDF();

        // Fecha y hora
        const fecha = new Date().toLocaleString("es-SV");

        // Identificador del comprobante
        const numeroComprobante = Date.now();

        // ====================================
        // ENCABEZADO
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
            "POKEMON BANK",
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
            "Simulador Bancario Academico",
            105,
            30,
            { align: "center" }
        );

        // ====================================
        // TÍTULO
        // ====================================

        documento.setTextColor(23, 63, 155);

        documento.setFontSize(16);

        documento.setFont(
            "helvetica",
            "bold"
        );

        documento.text(
            "COMPROBANTE DE TRANSACCION",
            105,
            60,
            { align: "center" }
        );

        // ====================================
        // INFORMACIÓN GENERAL
        // ====================================

        documento.setTextColor(0, 0, 0);

        documento.setFontSize(11);

        documento.setFont(
            "helvetica",
            "normal"
        );

        documento.text(
            "Comprobante No.: " + numeroComprobante,
            20,
            80
        );

        documento.text(
            "Fecha: " + fecha,
            20,
            90
        );

        documento.line(
            20,
            100,
            190,
            100
        );

        // ====================================
        // INFORMACIÓN DE LA CUENTA
        // ====================================

        documento.setFont(
            "helvetica",
            "bold"
        );

        documento.text(
            "INFORMACION DE LA CUENTA",
            20,
            112
        );

        documento.setFont(
            "helvetica",
            "normal"
        );

        documento.text(
            "Titular: " + this.titular,
            20,
            125
        );

        documento.text(
            "Numero de cuenta: " + this.numeroCuenta,
            20,
            135
        );

        documento.text(
            "Tipo de cuenta: " + this.tipoCuenta,
            20,
            145
        );

        documento.line(
            20,
            155,
            190,
            155
        );

        // ====================================
        // DETALLES DE LA OPERACIÓN
        // ====================================

        documento.setFont(
            "helvetica",
            "bold"
        );

        documento.text(
            "DETALLES DE LA OPERACION",
            20,
            167
        );

        documento.setFont(
            "helvetica",
            "normal"
        );

        documento.text(
            "Tipo: " + tipo,
            20,
            180
        );

        const descripcionLineas =
            documento.splitTextToSize(
                "Descripcion: " + (descripcion || tipo),
                165
            );

        documento.text(
            descripcionLineas,
            20,
            190
        );

        const posicionMonto =
            190 + descripcionLineas.length * 6 + 5;

        // ====================================
// INFORMACIÓN FINANCIERA
// ====================================

// Monto de la operación
documento.text(
    "Monto de la operacion: $" + monto.toFixed(2),
    20,
    posicionMonto
);

// Mostrar saldo anterior cuando esté disponible
if (
    saldoAnterior !== null &&
    Number.isFinite(saldoAnterior) &&
    saldoAnterior >= 0
) {

    documento.text(
        "Saldo anterior: $" + saldoAnterior.toFixed(2),
        20,
        posicionMonto + 12
    );

    documento.text(
        "Saldo resultante: $" + saldo.toFixed(2),
        20,
        posicionMonto + 24
    );

} else {

    documento.text(
        "Saldo resultante: $" + saldo.toFixed(2),
        20,
        posicionMonto + 12
    );

}

        // ====================================
        // AVISO ACADÉMICO
        // ====================================

        documento.setDrawColor(255, 204, 0);

        documento.line(
            20,
            250,
            190,
            250
        );

        documento.setFontSize(9);

        documento.setTextColor(100, 100, 100);

        documento.text(
            "Este documento corresponde a una",
            105,
            263,
            { align: "center" }
        );

        documento.text(
            "transaccion simulada con fines academicos.",
            105,
            270,
            { align: "center" }
        );

        documento.text(
            "No representa una operacion bancaria real.",
            105,
            277,
            { align: "center" }
        );

        // ====================================
        // DESCARGAR PDF
        // ====================================

        const nombreArchivo =
            "Pokemon_Bank_" +
            tipo.replace(/\s+/g, "_") +
            "_" +
            numeroComprobante +
            ".pdf";

      // ====================================
// DESCARGA SEGURA DEL COMPROBANTE
// ====================================

try {

    documento.save(nombreArchivo);

    console.log(
        "Comprobante generado correctamente:",
        nombreArchivo
    );

    return true;

} catch (error) {

    console.error(
        "Error al generar el comprobante PDF:",
        error
    );

    return false;

}

    }

};
