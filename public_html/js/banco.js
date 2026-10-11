/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/*
 * Pokémon Bank
 * Archivo: banco.js
 *
 * Administración central de las operaciones bancarias.
 * Simulador académico desarrollado con JavaScript.
 */

const Banco = {

    // Configuración inicial
    saldoInicial: 2500.00,

    claveSaldo: "pokemonBankSaldo",
    claveHistorial: "pokemonBankHistorial",

    // Inicializar los datos bancarios
    inicializar: function () {

        if (localStorage.getItem(this.claveSaldo) === null) {

            localStorage.setItem(
                this.claveSaldo,
                this.saldoInicial.toFixed(2)
            );

        }

        if (localStorage.getItem(this.claveHistorial) === null) {

            localStorage.setItem(
                this.claveHistorial,
                JSON.stringify([])
            );

        }

    },

    // Consultar saldo disponible
    obtenerSaldo: function () {

        this.inicializar();

        return Number(
            localStorage.getItem(this.claveSaldo)
        );

    },

    // Guardar saldo actualizado
    guardarSaldo: function (nuevoSaldo) {

        if (!Number.isFinite(nuevoSaldo) || nuevoSaldo < 0) {
            return false;
        }

        localStorage.setItem(
            this.claveSaldo,
            nuevoSaldo.toFixed(2)
        );

        return true;

    },

    // Consultar historial
    obtenerHistorial: function () {

        this.inicializar();

        return JSON.parse(
            localStorage.getItem(this.claveHistorial)
        );

    },

    // Registrar una transacción
    registrarTransaccion: function (tipo, descripcion, monto) {

        const historial = this.obtenerHistorial();

        const transaccion = {

            id: Date.now(),

            fecha: new Date().toLocaleString("es-SV"),

            tipo: tipo,

            descripcion: descripcion,

            monto: Number(monto.toFixed(2))

        };

        historial.push(transaccion);

        localStorage.setItem(
            this.claveHistorial,
            JSON.stringify(historial)
        );

        return transaccion;

    },

    // Realizar depósito
    depositar: function (monto) {

        monto = Number(monto);

        if (!Number.isFinite(monto) || monto <= 0 ||
            !Number.isInteger(monto * 100)) {

            return {
                exito: false,
                mensaje: "Ingresa un monto válido mayor a $0.00."
            };

        }

        const saldoActual = this.obtenerSaldo();

        const nuevoSaldo = saldoActual + monto;

        if (!this.guardarSaldo(nuevoSaldo)) {

            return {
                exito: false,
                mensaje: "No fue posible actualizar el saldo."
            };

        }

        this.registrarTransaccion(
            "Depósito",
            "Depósito a cuenta",
            monto
        );

        return {
            exito: true,
            mensaje: "Depósito realizado correctamente.",
            saldo: nuevoSaldo
        };

    },

    // Realizar retiro
    retirar: function (monto) {

        monto = Number(monto);

        if (!Number.isFinite(monto) || monto <= 0 ||
            !Number.isInteger(monto * 100)) {

            return {
                exito: false,
                mensaje: "Ingresa un monto válido mayor a $0.00."
            };

        }

        const saldoActual = this.obtenerSaldo();

        if (monto > saldoActual) {

            return {
                exito: false,
                mensaje: "Saldo insuficiente para realizar el retiro."
            };

        }

        const nuevoSaldo = saldoActual - monto;

        if (!this.guardarSaldo(nuevoSaldo)) {

            return {
                exito: false,
                mensaje: "No fue posible actualizar el saldo."
            };

        }

        this.registrarTransaccion(
            "Retiro",
            "Retiro de efectivo",
            monto
        );

        return {
            exito: true,
            mensaje: "Retiro realizado correctamente.",
            saldo: nuevoSaldo
        };

    },

    // Realizar pago de servicios
    pagarServicio: function (servicio, referencia, monto) {

        monto = Number(monto);

        if (!servicio || !referencia ||
            !String(referencia).trim()) {

            return {
                exito: false,
                mensaje: "Completa todos los datos del servicio."
            };

        }

        if (!Number.isFinite(monto) || monto <= 0 ||
            !Number.isInteger(monto * 100)) {

            return {
                exito: false,
                mensaje: "Ingresa un monto válido mayor a $0.00."
            };

        }

        const saldoActual = this.obtenerSaldo();

        if (monto > saldoActual) {

            return {
                exito: false,
                mensaje: "Saldo insuficiente para realizar el pago."
            };

        }

        const nuevoSaldo = saldoActual - monto;

        if (!this.guardarSaldo(nuevoSaldo)) {

            return {
                exito: false,
                mensaje: "No fue posible actualizar el saldo."
            };

        }

        this.registrarTransaccion(
            "Servicio",
            "Pago de " + servicio + " - Ref: " + referencia,
            monto
        );

        return {
            exito: true,
            mensaje: "Pago realizado correctamente.",
            saldo: nuevoSaldo
        };

    }

};

// Inicializar almacenamiento
Banco.inicializar();
