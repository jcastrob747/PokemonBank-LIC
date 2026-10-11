\# Pokémon Bank



\## Simulador Bancario Académico



Pokémon Bank es una aplicación web académica que simula

las operaciones principales de un cajero automático (ATM).



El proyecto fue desarrollado como parte de la asignatura

Lenguajes Interpretados en el Cliente.



Su objetivo es proporcionar una interfaz web intuitiva,

funcional y adaptable para realizar operaciones bancarias

simuladas utilizando los datos de una cuenta de prueba.



\---



\## 1. Objetivo del proyecto



Desarrollar una interfaz web que permita simular las

operaciones principales de un cajero automático mediante

HTML5, CSS3, Bootstrap y JavaScript.



La aplicación permite realizar transacciones simuladas,

consultar información bancaria y visualizar estadísticas

de las operaciones registradas.



\---



\## 2. Tecnologías utilizadas



\- HTML5: estructura de las páginas web.

\- CSS3: diseño visual y estilos personalizados.

\- Bootstrap 4.6: diseño adaptable.

\- JavaScript: lógica de las operaciones bancarias.

\- SVG: representación de gráficos estadísticos.

\- LocalStorage: almacenamiento de información bancaria.

\- SessionStorage: administración de sesiones.

\- Git: control de versiones.

\- GitHub: alojamiento del repositorio.

\- Apache NetBeans: entorno de desarrollo.



\---



\## 3. Funcionalidades



\### Inicio de sesión



\- Acceso mediante PIN de cuatro dígitos.

\- Validación del PIN ingresado.

\- Administración de sesiones.

\- Protección de las páginas internas.

\- Cierre de sesión.



\### Menú principal



\- Información del titular.

\- Número de cuenta.

\- Tipo de cuenta.

\- Acceso a las operaciones bancarias.



\### Depósitos



\- Registro de depósitos.

\- Validación de montos.

\- Actualización del saldo.

\- Registro automático en el historial.



\### Retiros



\- Registro de retiros.

\- Validación de fondos disponibles.

\- Actualización del saldo.

\- Registro automático de transacciones.



\### Consulta de saldo



\- Visualización del saldo disponible.

\- Actualización automática después de las operaciones.



\### Pago de servicios



Servicios disponibles:



\- Energía eléctrica.

\- Internet.

\- Telefonía.

\- Agua potable.



El módulo permite registrar referencias de pago,

validar montos y actualizar el saldo disponible.



\### Historial de transacciones



\- Consulta de depósitos.

\- Consulta de retiros.

\- Consulta de pagos de servicios.

\- Visualización de fechas y montos.

\- Clasificación de operaciones por tipo.



\### Estadísticas bancarias



\- Total de transacciones.

\- Total de depósitos.

\- Total de retiros.

\- Total de pagos de servicios.

\- Gráfico de distribución de operaciones.

\- Gráfico comparativo de montos.



Los gráficos se generan dinámicamente mediante

JavaScript y SVG.



\---



\## 4. Estructura del proyecto



```text

PokemonBank-LIC/

|

|-- public\_html/

|   |

|   |-- css/

|   |   |-- styles.css

|   |

|   |-- images/

|   |   |-- favicon.svg

|   |

|   |-- js/

|   |   |-- banco.js

|   |   |-- deposito.js

|   |   |-- retiro.js

|   |   |-- saldo.js

|   |   |-- servicios.js

|   |   |-- historial.js

|   |   |-- estadisticas.js

|   |   |-- login.js

|   |   |-- sesion.js

|   |

|   |-- index.html

|   |-- dashboard.html

|   |-- deposito.html

|   |-- retiro.html

|   |-- saldo.html

|   |-- servicios.html

|   |-- historial.html

|   |-- estadisticas.html

|

|-- nbproject/

|-- README.md

|-- .gitignore

|-- package.json

```



\---



\## 5. Funcionamiento del sistema



El simulador utiliza un saldo inicial de prueba

de $2,500.00.



Las operaciones bancarias modifican el saldo

disponible y registran automáticamente los

movimientos realizados.



Los datos se almacenan mediante LocalStorage,

permitiendo conservar las transacciones al

actualizar o cerrar el navegador.



La sesión del usuario se administra mediante

SessionStorage.



El sistema funciona completamente del lado

del cliente y no requiere una base de datos.



\---



\## 6. Instrucciones de ejecución



1\. Descargar o clonar el repositorio.

2\. Abrir el proyecto en Apache NetBeans.

3\. Ejecutar el archivo index.html.

4\. Ingresar el PIN de prueba configurado.

5\. Acceder al menú principal.

6\. Seleccionar la operación bancaria deseada.



También es posible ejecutar la aplicación

mediante un servidor web local.



\---



\## 7. Diseño adaptable



La aplicación utiliza Bootstrap 4.6 y CSS3.



Las interfaces fueron diseñadas para adaptarse

a diferentes resoluciones de pantalla.



Se realizaron pruebas de visualización en

computadoras y dispositivos móviles mediante

las herramientas de desarrollo de Google Chrome.



\---



\## 8. Control de versiones



El proyecto utiliza Git para administrar

las versiones del código fuente.



El repositorio remoto se encuentra alojado

en GitHub.



Rama principal: main.



Las modificaciones del proyecto se registran

mediante commits para mantener un historial

organizado del desarrollo.



\---



\## 9. Consideraciones académicas



Pokémon Bank es un simulador desarrollado

exclusivamente con fines educativos.



No se realizan operaciones bancarias reales.



Los saldos, movimientos y datos de cuenta

corresponden a información simulada.



La autenticación mediante PIN es una

implementación académica del lado del cliente

y no constituye un mecanismo de seguridad

adecuado para aplicaciones bancarias reales.



\---



\## 10. Autor



Proyecto académico desarrollado para la

asignatura Lenguajes Interpretados en el Cliente.



Año: 2026.

