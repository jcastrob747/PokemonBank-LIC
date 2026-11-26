/*
 * Pokémon Bank
 * Archivo: dashboard.js
 *
 * Fase 2 - Administración del menú principal.
 *
 * Responsabilidades:
 * - Verificar la sesión activa.
 * - Consultar los datos del usuario.
 * - Recuperar información desde LocalStorage.
 * - Actualizar dinámicamente la interfaz.
 * - Habilitar las operaciones bancarias.
 * - Gestionar errores de inicialización.
 *
 * Simulador bancario académico.
 * Lenguajes Interpretados en el Cliente.
 */


// ============================================
// 1. INICIALIZACIÓN DEL MÓDULO
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const nombreUsuario =
            document.getElementById("nombreUsuario");

    const tipoCuenta =
            document.getElementById("tipoCuenta");

    const numeroCuenta =
            document.getElementById("numeroCuenta");

    const mensaje =
            document.getElementById("dashboardMensaje");

    const menuOperaciones =
            document.getElementById("menuOperaciones");


    // ========================================
    // 2. VERIFICAR ELEMENTOS HTML
    // ========================================

    if (
            !nombreUsuario ||
            !tipoCuenta ||
            !numeroCuenta ||
            !mensaje ||
            !menuOperaciones
            ) {

        console.error(
                "Pokémon Bank - No se encontraron los elementos del Dashboard."
                );

        return;

    }


    // ========================================
    // 3. VERIFICAR DEPENDENCIAS
    // ========================================

    function verificarDependencias() {

        if (typeof Sesion === "undefined") {

            throw new Error(
                    "El administrador de sesiones no está disponible."
                    );

        }

        if (typeof Banco === "undefined") {

            throw new Error(
                    "El motor bancario no está disponible."
                    );

        }

    }


    // ========================================
    // 4. MOSTRAR MENSAJES DE ERROR
    // ========================================

    async function mostrarError(texto) {

        // Mantener un mensaje HTML de respaldo.

        mensaje.textContent = texto;

        mensaje.style.display = "block";


        // Presentar un diálogo interactivo.

        if (
                typeof Swal !== "undefined" &&
                typeof Swal.fire === "function"
                ) {

            await Swal.fire({

                icon: "error",

                title: "Error del sistema",

                text: texto,

                confirmButtonText: "Aceptar",

                confirmButtonColor: "#1e3a8a"

            });

        }

    }


    // ========================================
    // 5. ACTUALIZAR INFORMACIÓN DEL USUARIO
    // ========================================

    function mostrarUsuario(usuario) {

        // Utilizar textContent para insertar
        // información sin interpretar código HTML.

        nombreUsuario.textContent =
                usuario.nombre;

        tipoCuenta.textContent =
                usuario.tipoCuenta;

        numeroCuenta.textContent =
                usuario.cuenta;

    }


    // ========================================
    // 6. ADMINISTRAR MENÚ DE OPERACIONES
    // ========================================

    function habilitarOperaciones(estado) {

        menuOperaciones.hidden = !estado;

    }


    // ========================================
    // 7. INICIALIZAR DASHBOARD
    // ========================================

    async function inicializarDashboard() {

        // Mantener las operaciones ocultas
        // hasta verificar los datos bancarios.

        habilitarOperaciones(false);

        mensaje.textContent = "";

        mensaje.style.display = "none";


        try {

            // ================================
            // 7.1. VERIFICAR DEPENDENCIAS
            // ================================

            verificarDependencias();


            // ================================
            // 7.2. VERIFICAR SESIÓN
            // ================================

            if (!Sesion.verificarAcceso()) {

                return;

            }


            // ================================
            // 7.3. INICIALIZAR MOTOR BANCARIO
            // ================================

            if (Banco.inicializar() !== true) {

                throw new Error(
                        "No fue posible inicializar los datos bancarios."
                        );

            }


            // ================================
            // 7.4. RECUPERAR USUARIO
            // ================================

            const usuario =
                    Banco.obtenerUsuario();


            if (
                    !usuario ||
                    typeof usuario.nombre !== "string" ||
                    typeof usuario.tipoCuenta !== "string" ||
                    typeof usuario.cuenta !== "string"
                    ) {

                throw new Error(
                        "No fue posible recuperar la información del titular."
                        );

            }


            // ================================
            // 7.5. ACTUALIZAR INTERFAZ
            // ================================

            mostrarUsuario(usuario);


            // ================================
            // 7.6. HABILITAR OPERACIONES
            // ================================

            habilitarOperaciones(true);


            // ================================
            // 7.7. CONFIRMAR INICIALIZACIÓN
            // ================================

            console.log(
                    "Pokémon Bank - Dashboard de Fase 2 inicializado."
                    );


        } catch (error) {

            // Mantener las operaciones deshabilitadas.

            habilitarOperaciones(false);


            // Eliminar información visible.

            nombreUsuario.textContent = "---";

            tipoCuenta.textContent = "---";

            numeroCuenta.textContent = "---";


            console.error(
                    "Pokémon Bank - Error de inicialización del Dashboard:",
                    error
                    );


            await mostrarError(
                    "No fue posible recuperar los datos bancarios. Cierra sesión e intenta nuevamente."
                    );

        }

    }


    // ========================================
    // 8. VERIFICAR NAVEGACIÓN DESDE CACHÉ
    // ========================================

    window.addEventListener("pageshow", function (evento) {

        if (evento.persisted) {

            inicializarDashboard();

        }

    });


    // ========================================
    // 9. EJECUTAR INICIALIZACIÓN
    // ========================================

    inicializarDashboard();

});