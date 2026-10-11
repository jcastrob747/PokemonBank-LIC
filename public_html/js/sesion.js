/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/*
 * Pokémon Bank
 * Archivo: sesion.js
 *
 * Administración de sesiones del simulador bancario.
 *
 * Desafío Práctico
 * Lenguajes Interpretados en el Cliente
 *
 * JavaScript puro.
 */

// ============================================
// 1. CONFIGURACIÓN
// ============================================

const Sesion = {

    claveSesion: "pokemonBankSesion",


    // ========================================
    // 2. VERIFICAR SESIÓN ACTIVA
    // ========================================

    estaActiva: function () {

        return sessionStorage.getItem(
            this.claveSesion
        ) === "activa";

    },


    // ========================================
    // 3. PROTEGER PÁGINAS
    // ========================================

    verificarAcceso: function () {

        if (!this.estaActiva()) {

            console.warn(
                "Pokémon Bank - Acceso denegado. Sesión no iniciada."
            );

            window.location.replace("index.html");

            return false;

        }

        console.log(
            "Pokémon Bank - Sesión activa verificada."
        );

        return true;

    },


    // ========================================
    // 4. CERRAR SESIÓN
    // ========================================

    cerrarSesion: function () {

        sessionStorage.removeItem(
            this.claveSesion
        );

        console.log(
            "Pokémon Bank - Sesión cerrada correctamente."
        );

        window.location.replace("index.html");

    },


    // ========================================
    // 5. CONFIGURAR BOTONES
    // ========================================

    configurarBotones: function () {

        const botones = document.querySelectorAll(
            'a[href="index.html"]'
        );

        botones.forEach(function (boton) {

            boton.addEventListener("click", function (evento) {

                evento.preventDefault();

                Sesion.cerrarSesion();

            });

        });

    }

};


// ============================================
// 6. INICIALIZACIÓN
// ============================================

// Verificar acceso inmediatamente.
const accesoPermitido = Sesion.verificarAcceso();

if (accesoPermitido) {

    document.addEventListener("DOMContentLoaded", function () {

        Sesion.configurarBotones();

        console.log(
            "Pokémon Bank - Control de sesión inicializado."
        );

    });

}