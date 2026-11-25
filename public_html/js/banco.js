/*
 * Pokémon Bank
 * Archivo: banco.js
 *
 * Fase 2 - Administración central del sistema bancario.
 *
 * Responsabilidades:
 * - Inicialización de los datos del usuario.
 * - Persistencia mediante LocalStorage y JSON.
 * - Validación de operaciones bancarias.
 * - Administración del saldo disponible.
 * - Registro del historial de transacciones.
 * - Procesamiento de depósitos, retiros y servicios.
 *
 * Simulador bancario académico.
 * Lenguajes Interpretados en el Cliente.
 */

const Banco = {

    // ============================================
    // 1. CONFIGURACIÓN GENERAL
    // ============================================

    version: 2,

    claveDatos: "pokemonBankDatosV2",

    saldoInicialCentavos: 50000,

    serviciosPermitidos: Object.freeze({
        electricidad: "Energía eléctrica",
        internet: "Internet",
        telefonia: "Telefonía",
        agua: "Agua potable"
    }),


    // ============================================
    // 2. ESTRUCTURA INICIAL DE DATOS
    // ============================================

    crearDatosIniciales: function () {

        return {

            version: this.version,

            usuario: {

                nombre: "Ash Ketchum",

                pin: "1234",

                cuenta: "0987654321",

                tipoCuenta: "Cuenta de ahorros",

                moneda: "USD",

                saldoCentavos: this.saldoInicialCentavos

            },

            historial: []

        };

    },


    // ============================================
    // 3. INICIALIZACIÓN DEL SISTEMA
    // ============================================

    inicializar: function () {

        try {

            const datosGuardados =
                localStorage.getItem(this.claveDatos);

            // Crear los datos únicamente si no existen.

            if (datosGuardados === null) {

                const datosIniciales =
                    this.crearDatosIniciales();

                this.guardarDatos(datosIniciales);

                console.log(
                    "Pokémon Bank - Datos de Fase 2 inicializados."
                );

            } else {

                // Verificar los datos existentes.

                this.obtenerDatos();

                console.log(
                    "Pokémon Bank - Datos existentes recuperados."
                );

            }

            return true;

        } catch (error) {

            console.error(
                "Pokémon Bank - Error de inicialización:",
                error
            );

            return false;

        }

    },


    // ============================================
    // 4. VALIDACIÓN DE LA ESTRUCTURA JSON
    // ============================================

    validarDatos: function (datos) {

        if (
            !datos ||
            typeof datos !== "object" ||
            datos.version !== this.version ||
            !datos.usuario ||
            !Array.isArray(datos.historial)
        ) {

            return false;

        }

        const usuario = datos.usuario;

        if (
            typeof usuario.nombre !== "string" ||
            usuario.nombre.trim() === "" ||

            typeof usuario.pin !== "string" ||
            !/^[0-9]{4}$/.test(usuario.pin) ||

            typeof usuario.cuenta !== "string" ||
            !/^[0-9]{10}$/.test(usuario.cuenta) ||

            typeof usuario.tipoCuenta !== "string" ||
            usuario.tipoCuenta.trim() === "" ||

            usuario.moneda !== "USD" ||

            !Number.isSafeInteger(usuario.saldoCentavos) ||
            usuario.saldoCentavos < 0
        ) {

            return false;

        }

        // Verificar las transacciones almacenadas.

        const identificadores = new Set();

        let saldoEsperado = this.saldoInicialCentavos;

        for (const transaccion of datos.historial) {

            if (!this.validarTransaccion(transaccion)) {

                return false;

            }

            if (
                identificadores.has(transaccion.id) ||
                transaccion.cuenta !== usuario.cuenta ||
                transaccion.saldoAnteriorCentavos !== saldoEsperado
            ) {

                return false;

            }

            identificadores.add(transaccion.id);

            saldoEsperado =
                transaccion.saldoPosteriorCentavos;

        }

        // El saldo debe coincidir con el historial.

        return usuario.saldoCentavos === saldoEsperado;

    },


    // ============================================
    // 5. VALIDACIÓN DE TRANSACCIONES
    // ============================================

    validarTransaccion: function (transaccion) {

        if (
            !transaccion ||
            typeof transaccion !== "object"
        ) {

            return false;

        }

        const tiposPermitidos = [
            "Depósito",
            "Retiro",
            "Servicio"
        ];

        if (
            typeof transaccion.id !== "string" ||
            transaccion.id.trim() === "" ||

            typeof transaccion.fecha !== "string" ||
            !Number.isFinite(Date.parse(transaccion.fecha)) ||

            !tiposPermitidos.includes(transaccion.tipo) ||

            typeof transaccion.descripcion !== "string" ||
            transaccion.descripcion.trim() === "" ||

            typeof transaccion.cuenta !== "string" ||
            !/^[0-9]{10}$/.test(transaccion.cuenta) ||

            !Number.isSafeInteger(transaccion.montoCentavos) ||
            transaccion.montoCentavos <= 0 ||

            !Number.isSafeInteger(
                transaccion.saldoAnteriorCentavos
            ) ||

            !Number.isSafeInteger(
                transaccion.saldoPosteriorCentavos
            ) ||

            transaccion.saldoAnteriorCentavos < 0 ||
            transaccion.saldoPosteriorCentavos < 0
        ) {

            return false;

        }

        // Verificar la relación matemática de los saldos.

        const saldoCalculado =
            transaccion.tipo === "Depósito"

                ? transaccion.saldoAnteriorCentavos +
                  transaccion.montoCentavos

                : transaccion.saldoAnteriorCentavos -
                  transaccion.montoCentavos;

        if (
            !Number.isSafeInteger(saldoCalculado) ||
            saldoCalculado !==
                transaccion.saldoPosteriorCentavos
        ) {

            return false;

        }

        // Validaciones adicionales para servicios.

        if (transaccion.tipo === "Servicio") {

            if (
                !Object.prototype.hasOwnProperty.call(
                    this.serviciosPermitidos,
                    transaccion.servicio
                ) ||

                typeof transaccion.referencia !== "string" ||

                !/^[A-Za-z0-9-]{1,20}$/.test(
                    transaccion.referencia
                )
            ) {

                return false;

            }

        }

        return true;

    },


    // ============================================
    // 6. RECUPERACIÓN DE DATOS
    // ============================================

    obtenerDatos: function () {

        const datosGuardados =
            localStorage.getItem(this.claveDatos);

        if (datosGuardados === null) {

            throw new Error(
                "No existen datos bancarios inicializados."
            );

        }

        const datos = JSON.parse(datosGuardados);

        if (!this.validarDatos(datos)) {

            throw new Error(
                "La estructura de datos bancarios no es válida."
            );

        }

        return datos;

    },


    // ============================================
    // 7. ALMACENAMIENTO DE DATOS
    // ============================================

    guardarDatos: function (datos) {

        if (!this.validarDatos(datos)) {

            throw new Error(
                "No es posible almacenar datos bancarios inválidos."
            );

        }

        localStorage.setItem(

            this.claveDatos,

            JSON.stringify(datos)

        );

        return true;

    },


    // ============================================
    // 8. CONSULTA DE INFORMACIÓN DEL USUARIO
    // ============================================

    obtenerUsuario: function () {

        const usuario = this.obtenerDatos().usuario;

        // Excluir el PIN de las consultas de presentación.

        return {

            nombre: usuario.nombre,

            cuenta: usuario.cuenta,

            tipoCuenta: usuario.tipoCuenta,

            moneda: usuario.moneda,

            saldoCentavos: usuario.saldoCentavos,

            saldo: usuario.saldoCentavos / 100

        };

    },


    // ============================================
    // 9. VALIDACIÓN DEL PIN
    // ============================================

    validarPIN: function (pinIngresado) {

        if (
            typeof pinIngresado !== "string" ||
            !/^[0-9]{4}$/.test(pinIngresado)
        ) {

            return false;

        }

        const datos = this.obtenerDatos();

        return pinIngresado === datos.usuario.pin;

    },


    // ============================================
    // 10. CONVERSIÓN MONETARIA
    // ============================================

    convertirACentavos: function (monto) {

        if (
            typeof monto !== "string" &&
            typeof monto !== "number"
        ) {

            return null;

        }

        const valor = String(monto).trim();

        // Permitir únicamente cantidades positivas
        // con un máximo de dos posiciones decimales.

        if (!/^[0-9]+(?:\.[0-9]{1,2})?$/.test(valor)) {

            return null;

        }

        const partes = valor.split(".");

        const dolares = Number(partes[0]);

        const decimales = Number(
            (partes[1] || "").padEnd(2, "0")
        );

        const centavos =
            dolares * 100 + decimales;

        if (
            !Number.isSafeInteger(centavos) ||
            centavos <= 0
        ) {

            return null;

        }

        return centavos;

    },


    convertirADolares: function (centavos) {

        return centavos / 100;

    },


    // ============================================
    // 11. CONSULTA DEL SALDO
    // ============================================

    obtenerSaldoCentavos: function () {

        return this.obtenerDatos().usuario.saldoCentavos;

    },


    obtenerSaldo: function () {

        return this.convertirADolares(
            this.obtenerSaldoCentavos()
        );

    },


    // ============================================
    // 12. CONSULTA DEL HISTORIAL
    // ============================================

    obtenerHistorial: function () {

        const datos = this.obtenerDatos();

        // Mantener temporalmente la propiedad monto
        // para los módulos existentes de la Fase 1.

        return datos.historial.map(function (transaccion) {

            return {

                ...transaccion,

                monto: transaccion.montoCentavos / 100,

                saldoAnterior:
                    transaccion.saldoAnteriorCentavos / 100,

                saldoPosterior:
                    transaccion.saldoPosteriorCentavos / 100

            };

        });

    },


    // ============================================
    // 13. IDENTIFICADORES DE TRANSACCIONES
    // ============================================

    generarIdentificador: function (historial) {

        let identificador;

        do {

            if (
                typeof crypto !== "undefined" &&
                typeof crypto.randomUUID === "function"
            ) {

                identificador =
                    "PB-" + crypto.randomUUID();

            } else {

                identificador =
                    "PB-" +
                    Date.now().toString(36) +
                    "-" +
                    Math.random().toString(36).slice(2);

            }

        } while (

            historial.some(function (transaccion) {

                return transaccion.id === identificador;

            })

        );

        return identificador;

    },


    // ============================================
    // 14. PROCESAMIENTO CENTRAL DE TRANSACCIONES
    // ============================================

    procesarTransaccion: function (
        tipo,
        descripcion,
        monto,
        detalles = {}
    ) {

        try {

            const tiposPermitidos = [
                "Depósito",
                "Retiro",
                "Servicio"
            ];

            if (!tiposPermitidos.includes(tipo)) {

                return {

                    exito: false,

                    mensaje: "Tipo de operación no válido."

                };

            }

            const montoCentavos =
                this.convertirACentavos(monto);

            if (montoCentavos === null) {

                return {

                    exito: false,

                    mensaje:
                        "Ingresa un monto válido mayor a $0.00 " +
                        "con un máximo de dos decimales."

                };

            }

            const datos = this.obtenerDatos();

            const saldoAnterior =
                datos.usuario.saldoCentavos;

            // Verificar fondos para las operaciones de egreso.

            if (
                tipo !== "Depósito" &&
                montoCentavos > saldoAnterior
            ) {

                return {

                    exito: false,

                    mensaje:
                        "Saldo insuficiente para realizar la operación."

                };

            }

            // Calcular el saldo resultante.

            const saldoPosterior =

                tipo === "Depósito"

                    ? saldoAnterior + montoCentavos

                    : saldoAnterior - montoCentavos;

            if (
                !Number.isSafeInteger(saldoPosterior) ||
                saldoPosterior < 0
            ) {

                return {

                    exito: false,

                    mensaje:
                        "El saldo resultante no es válido."

                };

            }

            // Construir la transacción bancaria.

            const transaccion = {

                id: this.generarIdentificador(
                    datos.historial
                ),

                fecha: new Date().toISOString(),

                tipo: tipo,

                descripcion: descripcion,

                cuenta: datos.usuario.cuenta,

                montoCentavos: montoCentavos,

                saldoAnteriorCentavos: saldoAnterior,

                saldoPosteriorCentavos: saldoPosterior

            };

            // Incorporar datos específicos de servicios.

            if (tipo === "Servicio") {

                transaccion.servicio = detalles.servicio;

                transaccion.referencia = detalles.referencia;

            }

            // Actualizar el saldo y registrar la operación.

            datos.usuario.saldoCentavos = saldoPosterior;

            datos.historial.push(transaccion);

            // Guardar conjuntamente el saldo y el historial.

            this.guardarDatos(datos);

            return {

                exito: true,

                mensaje:
                    tipo === "Depósito"

                        ? "Depósito realizado correctamente."

                        : tipo === "Retiro"

                            ? "Retiro realizado correctamente."

                            : "Pago de servicio realizado correctamente.",

                saldo: saldoPosterior / 100,

                saldoAnterior: saldoAnterior / 100,

                transaccion: transaccion

            };

        } catch (error) {

            console.error(
                "Pokémon Bank - Error de transacción:",
                error
            );

            return {

                exito: false,

                mensaje:
                    "No fue posible completar la operación bancaria."

            };

        }

    },


    // ============================================
    // 15. DEPÓSITOS
    // ============================================

    depositar: function (monto) {

        return this.procesarTransaccion(

            "Depósito",

            "Depósito a cuenta",

            monto

        );

    },


    // ============================================
    // 16. RETIROS
    // ============================================

    retirar: function (monto) {

        return this.procesarTransaccion(

            "Retiro",

            "Retiro de efectivo",

            monto

        );

    },


    // ============================================
    // 17. PAGO DE SERVICIOS
    // ============================================

    pagarServicio: function (
        servicio,
        referencia,
        monto
    ) {

        // Verificar el tipo de servicio.

        if (
            typeof servicio !== "string" ||

            !Object.prototype.hasOwnProperty.call(
                this.serviciosPermitidos,
                servicio
            )
        ) {

            return {

                exito: false,

                mensaje: "Selecciona un servicio válido."

            };

        }

        // Verificar la referencia ingresada.

        if (typeof referencia !== "string") {

            return {

                exito: false,

                mensaje: "Ingresa una referencia válida."

            };

        }

        referencia = referencia.trim();

        if (!/^[A-Za-z0-9-]{1,20}$/.test(referencia)) {

            return {

                exito: false,

                mensaje:
                    "La referencia debe contener entre 1 y 20 " +
                    "caracteres alfanuméricos o guiones."

            };

        }

        const nombreServicio =
            this.serviciosPermitidos[servicio];

        const descripcion =

            "Pago de " +

            nombreServicio +

            " - Ref: " +

            referencia;

        return this.procesarTransaccion(

            "Servicio",

            descripcion,

            monto,

            {

                servicio: servicio,

                referencia: referencia

            }

        );

    }

};


// ============================================
// 18. INICIALIZACIÓN AUTOMÁTICA
// ============================================

Banco.inicializar();