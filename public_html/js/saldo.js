/*
 * Pokémon Bank
 * Archivo: saldo.js
 *
 * Fase 2 - Módulo de consulta de saldo.
 *
 * Responsabilidades:
 * - Verificar las dependencias del módulo.
 * - Comprobar la existencia de una sesión activa.
 * - Recuperar la información bancaria del titular.
 * - Verificar la integridad de los datos.
 * - Formatear y presentar el saldo disponible.
 * - Administrar errores mediante SweetAlert2.
 * - Actualizar la información al regresar desde caché.
 *
 * Este módulo realiza operaciones de solo lectura.
 * No modifica el saldo ni registra transacciones.
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

    const numeroCuenta =
        document.getElementById("numeroCuenta");

    const tipoCuenta =
        document.getElementById("tipoCuenta");

    const elementoSaldo =
        document.getElementById("saldoDisponible");

    const monedaCuenta =
        document.getElementById("monedaCuenta");

    const informacionCuenta =
        document.getElementById("informacionCuenta");

    const tarjetaSaldo =
        document.getElementById("tarjetaSaldo");

    const mensaje =
        document.getElementById("saldoMensaje");


    // Verificar la existencia de los elementos HTML.

    if (
        !nombreUsuario ||
        !numeroCuenta ||
        !tipoCuenta ||
        !elementoSaldo ||
        !monedaCuenta ||
        !informacionCuenta ||
        !tarjetaSaldo ||
        !mensaje
    ) {

        console.error(

            "Pokémon Bank - No se encontraron los elementos del módulo de saldo."

        );

        return;

    }


    // ========================================
    // 2. VERIFICAR DEPENDENCIAS
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

        if (typeof Swal === "undefined") {

            throw new Error(

                "La biblioteca SweetAlert2 no está disponible."

            );

        }

    }


    // ========================================
    // 3. LIMPIAR INFORMACIÓN BANCARIA
    // ========================================

    function limpiarInformacion() {

        nombreUsuario.textContent = "";

        numeroCuenta.textContent = "";

        tipoCuenta.textContent = "";

        elementoSaldo.textContent = "";

        monedaCuenta.textContent = "";

        informacionCuenta.hidden = true;

        tarjetaSaldo.hidden = true;

        mensaje.textContent = "";

        mensaje.style.display = "none";

    }


    // ========================================
    // 4. MOSTRAR MENSAJES DE ERROR
    // ========================================

    async function mostrarError(texto) {

        // Mensaje HTML de respaldo.

        mensaje.textContent = texto;

        mensaje.style.display = "block";


        // Presentar un diálogo interactivo.

        if (typeof Swal !== "undefined") {

            await Swal.fire({

                icon: "error",

                title: "Consulta no disponible",

                text: texto,

                confirmButtonText: "Aceptar",

                confirmButtonColor: "#1e3a8a"

            });

        }

    }


    // ========================================
    // 5. FORMATEAR SALDO MONETARIO
    // ========================================

    function formatearSaldo(saldo, moneda) {

        return saldo.toLocaleString(

            "en-US",

            {

                style: "currency",

                currency: moneda,

                minimumFractionDigits: 2,

                maximumFractionDigits: 2

            }

        );

    }


    // ========================================
    // 6. PRESENTAR INFORMACIÓN BANCARIA
    // ========================================

    function mostrarInformacion(usuario) {

        // Presentar datos mediante textContent.

        nombreUsuario.textContent =
            usuario.nombre;

        numeroCuenta.textContent =
            usuario.cuenta;

        tipoCuenta.textContent =
            usuario.tipoCuenta;


        // Presentar el saldo monetario.

        elementoSaldo.textContent =
            formatearSaldo(

                usuario.saldo,

                usuario.moneda

            );


        // Presentar la moneda de la cuenta.

        monedaCuenta.textContent =

            usuario.moneda === "USD"

                ? "Dólares estadounidenses (USD)"

                : usuario.moneda;


        // Habilitar los contenedores.

        informacionCuenta.hidden = false;

        tarjetaSaldo.hidden = false;

    }


    // ========================================
    // 7. INICIALIZAR CONSULTA DE SALDO
    // ========================================

    async function inicializarSaldo() {

        limpiarInformacion();

        try {

            // ================================
            // 7.1. VERIFICAR DEPENDENCIAS
            // ================================

            verificarDependencias();


            // ================================
            // 7.2. VERIFICAR SESIÓN ACTIVA
            // ================================

            if (Sesion.estaActiva() !== true) {

                window.location.replace(

                    "index.html"

                );

                return;

            }


            // ================================
            // 7.3. INICIALIZAR MOTOR BANCARIO
            // ================================

            if (Banco.inicializar() !== true) {

                throw new Error(

                    "No fue posible inicializar el motor bancario."

                );

            }


            // ================================
            // 7.4. VERIFICAR INTEGRIDAD
            // ================================

            const datos =
                Banco.obtenerDatos();

            if (Banco.validarDatos(datos) !== true) {

                throw new Error(

                    "Los datos bancarios no cumplen las reglas de integridad."

                );

            }


            // ================================
            // 7.5. RECUPERAR TITULAR
            // ================================

            const usuario =
                Banco.obtenerUsuario();

            if (

                !usuario ||

                typeof usuario.nombre !== "string" ||

                usuario.nombre.trim() === "" ||

                typeof usuario.cuenta !== "string" ||

                !/^[0-9]{10}$/.test(usuario.cuenta) ||

                typeof usuario.tipoCuenta !== "string" ||

                usuario.tipoCuenta.trim() === "" ||

                typeof usuario.moneda !== "string" ||

                !/^[A-Z]{3}$/.test(usuario.moneda)

            ) {

                throw new Error(

                    "No fue posible recuperar la información del titular."

                );

            }


            // ================================
            // 7.6. VALIDAR SALDO DISPONIBLE
            // ================================

            if (

                !Number.isSafeInteger(usuario.saldoCentavos) ||

                usuario.saldoCentavos < 0 ||

                !Number.isFinite(usuario.saldo) ||

                usuario.saldo < 0 ||

                usuario.saldo !== usuario.saldoCentavos / 100

            ) {

                throw new Error(

                    "El saldo bancario recuperado no es válido."

                );

            }


            // ================================
            // 7.7. PRESENTAR INFORMACIÓN
            // ================================

            mostrarInformacion(usuario);


            // ================================
            // 7.8. CONFIRMAR INICIALIZACIÓN
            // ================================

            console.log(

                "Pokémon Bank - Consulta de saldo de Fase 2 inicializada."

            );

            console.log(

                "Pokémon Bank - Saldo disponible:",

                usuario.saldo.toFixed(2)

            );

        } catch (error) {

            // Evitar presentar información parcial
            // o información bancaria incorrecta.

            limpiarInformacion();

            console.error(

                "Pokémon Bank - Error durante la consulta de saldo:",

                error

            );

            await mostrarError(

                "No fue posible recuperar la información bancaria. Cierra sesión e intenta nuevamente."

            );

        }

    }


    // ========================================
    // 8. VERIFICAR NAVEGACIÓN DESDE CACHÉ
    // ========================================

    window.addEventListener("pageshow", function (evento) {

        if (evento.persisted) {

            inicializarSaldo();

        }

    });


    // ========================================
    // 9. EJECUTAR INICIALIZACIÓN
    // ========================================

    inicializarSaldo();

});