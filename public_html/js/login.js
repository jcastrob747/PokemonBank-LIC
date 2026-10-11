/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


/*
 * Pokémon Bank
 * Archivo: login.js
 *
 * Validación del inicio de sesión.
 *
 * Simulador bancario académico.
 * Lenguajes Interpretados en el Cliente.
 */

// ============================================
// 1. CONFIGURACIÓN DEL SISTEMA
// ============================================

// PIN de prueba para el simulador académico
const PIN_CORRECTO = "1234";


// ============================================
// 2. INICIALIZACIÓN
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("loginForm");

    const campoPIN = document.getElementById("pin");

    const mensaje = document.getElementById("loginMensaje");

    if (!formulario || !campoPIN || !mensaje) {
        console.error("No se encontraron los elementos del formulario.");
        return;
    }


    // ========================================
    // 3. VALIDACIÓN DEL FORMULARIO
    // ========================================

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const pinIngresado = campoPIN.value.trim();

        // Ocultar mensajes anteriores
        mensaje.style.display = "none";
        mensaje.textContent = "";


        // Validar formato del PIN
        const expresionPIN = /^[0-9]{4}$/;

        if (!expresionPIN.test(pinIngresado)) {

            mostrarError(
                "El PIN debe contener exactamente 4 dígitos numéricos."
            );

            return;
        }


        // Validar PIN autorizado
        if (pinIngresado !== PIN_CORRECTO) {

            mostrarError(
                "PIN incorrecto. Intenta nuevamente."
            );

            campoPIN.value = "";

            campoPIN.focus();

            return;
        }


        // ====================================
        // 4. ACCESO CORRECTO
        // ====================================

        console.log(
            "Pokémon Bank - Inicio de sesión exitoso."
        );

        // Registrar acceso para el simulador
        sessionStorage.setItem(
            "pokemonBankSesion",
            "activa"
        );

        // Redirigir al menú principal
        window.location.href = "dashboard.html";

    });


    // ========================================
    // 5. MOSTRAR MENSAJES DE ERROR
    // ========================================

    function mostrarError(texto) {

        mensaje.textContent = texto;

        mensaje.style.display = "block";

    }


    // ========================================
    // 6. LIMPIAR MENSAJES
    // ========================================

    campoPIN.addEventListener("input", function () {

        mensaje.style.display = "none";

        mensaje.textContent = "";

    });


    console.log(
        "Pokémon Bank - Módulo de inicio de sesión cargado."
    );

});