/*
 * Pokémon Bank
 * Archivo: login.js
 *
 * Fase 2 - Módulo de autenticación.
 *
 * Responsabilidades:
 * - Capturar las credenciales del usuario.
 * - Validar el formato del PIN mediante ValidateJS.
 * - Consultar los datos bancarios almacenados en LocalStorage.
 * - Verificar las credenciales del titular.
 * - Administrar el acceso mediante SessionStorage.
 * - Presentar mensajes interactivos mediante SweetAlert2.
 * - Gestionar errores durante la autenticación.
 *
 * Simulador bancario académico.
 * Lenguajes Interpretados en el Cliente.
 */


// ============================================
// 1. INICIALIZACIÓN DEL MÓDULO
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const formulario =
        document.getElementById("loginForm");

    const campoPIN =
        document.getElementById("pin");

    const mensaje =
        document.getElementById("loginMensaje");


    // Verificar la existencia de los elementos HTML.

    if (!formulario || !campoPIN || !mensaje) {

        console.error(
            "Pokémon Bank - No se encontraron los elementos del formulario."
        );

        return;

    }


    const botonIngresar =
        formulario.querySelector('[type="submit"]');


    // Controlar solicitudes simultáneas.

    let procesando = false;


    // ========================================
    // 2. REGLAS DE VALIDACIÓN
    // ========================================

    const restricciones = {

        pin: {

            presence: {

                allowEmpty: false,

                message: "^Ingresa tu PIN."

            },

            format: {

                pattern: /^[0-9]{4}$/,

                message:
                    "^El PIN debe contener exactamente 4 dígitos numéricos."

            }

        }

    };


    // ========================================
    // 3. VERIFICAR DEPENDENCIAS
    // ========================================

    function verificarDependencias() {

        if (typeof Banco === "undefined") {

            throw new Error(
                "El motor bancario no está disponible."
            );

        }
        if (typeof Sesion === "undefined") {

    throw new Error(
        "El administrador de sesiones no está disponible."
    );

}

        if (typeof validate !== "function") {

            throw new Error(
                "La biblioteca ValidateJS no está disponible."
            );

        }

        if (typeof Swal === "undefined") {

            throw new Error(
                "La biblioteca SweetAlert2 no está disponible."
            );

        }

    }


    // ========================================
    // 4. ADMINISTRAR EL FORMULARIO
    // ========================================

    function establecerProcesando(estado) {

        procesando = estado;

        if (botonIngresar) {

            botonIngresar.disabled = estado;

        }

        campoPIN.disabled = estado;

    }


    // ========================================
    // 5. LIMPIAR MENSAJES
    // ========================================

    function limpiarMensaje() {

        mensaje.textContent = "";

        mensaje.style.display = "none";

    }


    // ========================================
    // 6. MOSTRAR MENSAJES DE ERROR
    // ========================================

    async function mostrarError(titulo, texto) {

        // Mantener un mensaje HTML como respaldo.

        mensaje.textContent = texto;

        mensaje.style.display = "block";


        // Mostrar un diálogo interactivo cuando
        // SweetAlert2 se encuentre disponible.

        if (typeof Swal !== "undefined") {

            await Swal.fire({

                icon: "error",

                title: titulo,

                text: texto,

                confirmButtonText: "Aceptar",

                confirmButtonColor: "#1e3a8a"

            });

        }

    }


    // ========================================
    // 7. PROCESAR INICIO DE SESIÓN
    // ========================================

    formulario.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            // Evitar múltiples solicitudes.

            if (procesando) {

                return;

            }


            limpiarMensaje();

            const pinIngresado =
                campoPIN.value.trim();


            establecerProcesando(true);


            try {

                // ============================
                // 7.1. VERIFICAR DEPENDENCIAS
                // ============================

                verificarDependencias();


                // ============================
                // 7.2. VALIDAR FORMATO DEL PIN
                // ============================

                const errores = validate(

                    {
                        pin: pinIngresado
                    },

                    restricciones

                );


                if (errores) {

                    await mostrarError(

                        "PIN no válido",

                        errores.pin[0]

                    );

                    return;

                }


                // ============================
                // 7.3. INICIALIZAR MOTOR
                // ============================

                if (Banco.inicializar() !== true) {

                    throw new Error(

                        "No fue posible inicializar los datos bancarios."

                    );

                }


// ============================
// 7.4. VERIFICAR CREDENCIAL
// ============================

// Delegar la autenticación al motor bancario.
// El PIN no se expone mediante obtenerUsuario().

if (Banco.validarPIN(pinIngresado) !== true) {

    campoPIN.value = "";


    await mostrarError(

        "Acceso denegado",

        "PIN incorrecto. Intenta nuevamente."

    );

    return;

}


// ============================
// 7.5. CONSULTAR USUARIO
// ============================

// Recuperar únicamente los datos destinados
// a la presentación del usuario autenticado.

const usuario =
    Banco.obtenerUsuario();


if (
    !usuario ||
    typeof usuario.nombre !== "string" ||
    usuario.nombre.trim() === ""
) {

    throw new Error(

        "No fue posible recuperar los datos del usuario."

    );

}

                // ============================
                // 7.6. REGISTRAR SESIÓN
                // ============================

if (Sesion.iniciarSesion() !== true) {

    throw new Error(

        "No fue posible establecer la sesión del usuario."

    );

}


                // ============================
                // 7.7. CONFIRMAR AUTENTICACIÓN
                // ============================

                console.log(

                    "Pokémon Bank - Inicio de sesión exitoso."

                );


                await Swal.fire({

                    icon: "success",

                    title: "Acceso autorizado",

                    text: "Bienvenido, " + usuario.nombre + ".",

                    confirmButtonText: "Continuar",

                    confirmButtonColor: "#1e3a8a",

                    allowOutsideClick: false,

                    allowEscapeKey: false

                });


                // ============================
                // 7.8. REDIRIGIR AL DASHBOARD
                // ============================

                window.location.replace(

                    "dashboard.html"

                );


            } catch (error) {

                // Eliminar cualquier sesión que
                // pudiera haberse creado parcialmente.

              if (typeof Sesion !== "undefined") {

    Sesion.eliminarSesion();

}


                console.error(

                    "Pokémon Bank - Error de autenticación:",

                    error

                );


                await mostrarError(

                    "Error del sistema",

                    "No fue posible iniciar sesión. Intenta nuevamente."

                );


            } finally {

                establecerProcesando(false);

                campoPIN.focus();

            }

        }

    );


    // ========================================
    // 8. LIMPIAR MENSAJES AL ESCRIBIR
    // ========================================

    campoPIN.addEventListener(

        "input",

        function () {

            limpiarMensaje();

        }

    );


    // ========================================
    // 9. CONFIRMACIÓN DE CARGA
    // ========================================

    console.log(

        "Pokémon Bank - Módulo de autenticación de Fase 2 cargado."

    );

});