/*
 * Pokémon Bank
 * Archivo: sesion.js
 *
 * Fase 2 - Administración centralizada de sesiones.
 *
 * Responsabilidades:
 * - Registrar el inicio de sesión.
 * - Verificar el estado de autenticación.
 * - Proteger las páginas internas del simulador.
 * - Administrar el cierre de sesión.
 * - Conservar los datos bancarios de LocalStorage.
 * - Gestionar errores de SessionStorage.
 * - Verificar el acceso durante la navegación.
 *
 * Simulador bancario académico.
 * Lenguajes Interpretados en el Cliente.
 */


// ============================================
// 1. CONFIGURACIÓN GENERAL
// ============================================

const Sesion = {

    claveSesion: "pokemonBankSesion",

    valorSesionActiva: "activa",

    paginaLogin: "index.html",

    paginaPrincipal: "dashboard.html",

    botonesConfigurados: new WeakSet(),


    // ========================================
    // 2. IDENTIFICAR PÁGINA ACTUAL
    // ========================================

    obtenerPaginaActual: function () {

        const ruta = window.location.pathname;

        return ruta.substring(
            ruta.lastIndexOf("/") + 1
        ).toLowerCase();

    },


    // ========================================
    // 3. IDENTIFICAR PÁGINA DE LOGIN
    // ========================================

    esPaginaLogin: function () {

        const pagina = this.obtenerPaginaActual();

        return (
            pagina === "" ||
            pagina === this.paginaLogin
        );

    },


    // ========================================
    // 4. INICIAR SESIÓN
    // ========================================

    iniciarSesion: function () {

        try {

            sessionStorage.setItem(
                this.claveSesion,
                this.valorSesionActiva
            );

            if (!this.estaActiva()) {

                throw new Error(
                    "No fue posible verificar la sesión creada."
                );

            }

            console.log(
                "Pokémon Bank - Sesión iniciada correctamente."
            );

            return true;

        } catch (error) {

            console.error(
                "Pokémon Bank - Error al iniciar sesión:",
                error
            );

            return false;

        }

    },


    // ========================================
    // 5. VERIFICAR SESIÓN ACTIVA
    // ========================================

    estaActiva: function () {

        try {

            return sessionStorage.getItem(
                this.claveSesion
            ) === this.valorSesionActiva;

        } catch (error) {

            console.error(
                "Pokémon Bank - Error al consultar la sesión:",
                error
            );

            return false;

        }

    },


    // ========================================
    // 6. ELIMINAR SESIÓN
    // ========================================

    eliminarSesion: function () {

        try {

            // Eliminar exclusivamente la clave
            // correspondiente a la autenticación.

            sessionStorage.removeItem(
                this.claveSesion
            );

            return sessionStorage.getItem(
                this.claveSesion
            ) === null;

        } catch (error) {

            console.error(
                "Pokémon Bank - Error al eliminar la sesión:",
                error
            );

            return false;

        }

    },


    // ========================================
    // 7. PROTEGER PÁGINAS INTERNAS
    // ========================================

    verificarAcceso: function () {

        // La página de inicio de sesión
        // debe permanecer accesible.

        if (this.esPaginaLogin()) {

            return true;

        }


        // Verificar autenticación en páginas internas.

        if (!this.estaActiva()) {

            console.warn(
                "Pokémon Bank - Acceso denegado. Sesión no iniciada."
            );

            window.location.replace(
                this.paginaLogin
            );

            return false;

        }

        console.log(
            "Pokémon Bank - Sesión activa verificada."
        );

        return true;

    },


    // ========================================
    // 8. CERRAR SESIÓN
    // ========================================

    cerrarSesion: function () {

        // No modificar LocalStorage.
        // El saldo y el historial deben conservarse.

        if (!this.eliminarSesion()) {

            console.error(
                "Pokémon Bank - No fue posible cerrar la sesión."
            );

            if (
                typeof Swal !== "undefined" &&
                typeof Swal.fire === "function"
            ) {

                Swal.fire({

                    icon: "error",

                    title: "Error de sesión",

                    text:
                        "No fue posible cerrar la sesión. Intenta nuevamente.",

                    confirmButtonText: "Aceptar",

                    confirmButtonColor: "#1e3a8a"

                });

            }

            return false;

        }

        console.log(
            "Pokémon Bank - Sesión cerrada correctamente."
        );

        window.location.replace(
            this.paginaLogin
        );

        return true;

    },


    // ========================================
    // 9. CONFIGURAR BOTONES DE CIERRE
    // ========================================

    configurarBotones: function () {

        const botones = document.querySelectorAll(
            'a[href="index.html"]'
        );

        botones.forEach(function (boton) {

            // Evitar registrar eventos duplicados.

            if (Sesion.botonesConfigurados.has(boton)) {

                return;

            }

            boton.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();

                    Sesion.cerrarSesion();

                }
            );

            Sesion.botonesConfigurados.add(boton);

        });

    },


    // ========================================
    // 10. INICIALIZAR CONTROL DE SESIÓN
    // ========================================

    inicializar: function () {

        // No aplicar restricciones a la página de login.

        if (this.esPaginaLogin()) {

            console.log(
                "Pokémon Bank - Administrador de sesiones disponible."
            );

            return true;

        }


        // Verificar acceso a páginas internas.

        if (!this.verificarAcceso()) {

            return false;

        }


        // Configurar eventos después de cargar el DOM.

        if (document.readyState === "loading") {

            document.addEventListener(
                "DOMContentLoaded",
                function () {

                    Sesion.configurarBotones();

                    console.log(
                        "Pokémon Bank - Control de sesión inicializado."
                    );

                },
                { once: true }
            );

        } else {

            this.configurarBotones();

        }


        // Verificar nuevamente la sesión cuando
        // una página se recupera desde la caché
        // de navegación del navegador.

        window.addEventListener(
            "pageshow",
            function (evento) {

                if (evento.persisted) {

                    Sesion.verificarAcceso();

                }

            }
        );

        return true;

    }

};


// ============================================
// 11. EJECUTAR ADMINISTRADOR DE SESIONES
// ============================================

Sesion.inicializar();