# Pokémon Bank – Simulador Bancario

## Descripción del proyecto

Pokémon Bank es una aplicación web que simula las operaciones principales de un cajero automático bancario. El proyecto fue desarrollado con fines académicos para la asignatura Lenguajes Interpretados en el Cliente, correspondiente a la carrera de Ingeniería en Ciencias de la Computación de la Universidad Don Bosco.

La aplicación permite administrar una cuenta bancaria simulada mediante tecnologías ejecutadas del lado del cliente, sin necesidad de un servidor de aplicaciones o una base de datos externa.

## Demostración en línea

https://jcastrob747.github.io/PokemonBank-LIC/

## Datos de acceso

| Campo | Valor |
|---|---|
| Titular | Ash Ketchum |
| PIN | 1234 |
| Número de cuenta | 0987654321 |
| Tipo de cuenta | Cuenta de ahorros |
| Saldo inicial | $500.00 USD |

## Funcionalidades

- Inicio y cierre de sesión.
- Control de acceso a páginas internas.
- Consulta de información bancaria.
- Consulta de saldo disponible.
- Depósitos bancarios.
- Retiros de efectivo.
- Pago de servicios.
- Validación de formularios.
- Confirmaciones y notificaciones interactivas.
- Historial persistente de transacciones.
- Generación de comprobantes PDF.
- Descarga de comprobantes desde el historial.
- Estadísticas bancarias dinámicas.
- Gráficos de distribución y comparación de operaciones.
- Diseño adaptable a dispositivos móviles.

## Tecnologías utilizadas

| Tecnología | Aplicación |
|---|---|
| HTML5 | Estructura de las interfaces |
| CSS3 | Diseño y presentación visual |
| JavaScript | Lógica bancaria y procesamiento de información |
| Bootstrap 4.6 | Diseño adaptable |
| LocalStorage | Persistencia de información bancaria |
| SessionStorage | Administración de sesión |
| ValidateJS | Validación de formularios |
| SweetAlert2 | Cuadros de diálogo interactivos |
| jsPDF | Generación de comprobantes PDF |
| Chart.js 4.4.8 | Representación gráfica de transacciones |
| NetBeans | Entorno de desarrollo |
| Git | Control de versiones |
| GitHub | Administración del repositorio |
| GitHub Pages | Publicación de la aplicación |

## Arquitectura del sistema

La aplicación utiliza una arquitectura modular del lado del cliente. La lógica bancaria se encuentra centralizada en JavaScript, mientras que los diferentes módulos gestionan las interfaces, validaciones, sesiones, comprobantes y estadísticas.

La información bancaria se almacena mediante una estructura JSON persistente en LocalStorage.

Para mejorar la precisión de las operaciones monetarias, los cálculos financieros se realizan mediante centavos enteros.

## Estructura del proyecto

```text
PokemonBank-LIC/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public_html/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   └── favicon.svg
│   ├── js/
│   │   ├── banco.js
│   │   ├── comprobantes.js
│   │   ├── dashboard.js
│   │   ├── deposito.js
│   │   ├── estadisticas.js
│   │   ├── historial.js
│   │   ├── login.js
│   │   ├── retiro.js
│   │   ├── saldo.js
│   │   ├── servicios.js
│   │   ├── sesion.js
│   │   └── transacciones.js
│   ├── dashboard.html
│   ├── deposito.html
│   ├── estadisticas.html
│   ├── historial.html
│   ├── index.html
│   ├── retiro.html
│   ├── saldo.html
│   └── servicios.html
└── README.md
```

## Almacenamiento de información

La segunda fase utiliza las siguientes claves principales:

| Almacenamiento | Clave | Propósito |
|---|---|---|
| LocalStorage | pokemonBankDatosV2 | Información bancaria e historial |
| SessionStorage | pokemonBankSesion | Control de sesión activa |

La información almacenada incluye los datos del titular, número de cuenta, saldo disponible y registro de transacciones.

Cada transacción contiene información que permite identificar la operación, su fecha, tipo, descripción, monto y saldos asociados.

## Comprobantes bancarios

La aplicación utiliza jsPDF para generar comprobantes descargables correspondientes a depósitos, retiros y pagos de servicios.

Los comprobantes incluyen:

- Identificador único de la transacción.
- Fecha y hora.
- Información del titular.
- Número y tipo de cuenta.
- Descripción de la operación.
- Saldo anterior.
- Monto de la transacción.
- Saldo resultante.
- Aviso de simulación académica.

Los comprobantes también pueden descargarse nuevamente desde el historial de transacciones.

## Estadísticas bancarias

Mediante Chart.js se generan dos gráficos dinámicos:

1. Gráfico de anillo para representar la cantidad y distribución porcentual de las operaciones.
2. Gráfico de barras para comparar los montos acumulados por tipo de transacción.

Los gráficos utilizan la información almacenada en el historial bancario.

## Pruebas y validaciones

Durante el desarrollo se realizaron pruebas funcionales, técnicas y visuales para comprobar el comportamiento de los diferentes módulos.

| Prueba | Descripción | Resultado |
|---|---|---|
| SA12 | Diagnóstico final del módulo de saldo | 32/32 aprobadas |
| TR01 | Estado inicial de operaciones | 8/8 aprobadas |
| TR02 | Depósito bancario | 10/10 aprobadas |
| TR02-PDF | Generación del comprobante corregido | 17/17 aprobadas |
| TR03 | Retiro bancario | 19/19 aprobadas |
| TR04 | Pago de servicios | 21/21 aprobadas |
| TR05 | Validación consolidada de operaciones inválidas | 10/10 casos aprobados |
| ES01 | Validación consolidada de estadísticas | 31/31 aprobadas |
| PF01 | Prueba integral final | 24/24 aprobadas |

También se verificó la descarga de comprobantes desde el historial y la presentación de las interfaces mediante emulación de dispositivos móviles.

La prueba integral final PF01 obtuvo un cumplimiento del 100 %.

## Control de versiones

El proyecto fue desarrollado en dos fases.

### Fase 1

Implementación inicial del simulador bancario, sus interfaces y operaciones principales.

La versión original se encuentra preservada mediante la etiqueta:

`v1.0-fase1`

### Fase 2

Ampliación y actualización del sistema mediante almacenamiento JSON, validaciones avanzadas, comprobantes dinámicos, historial persistente y gráficos estadísticos con Chart.js.

El desarrollo de esta fase se realizó en la rama:

`fase2`

## Ejecución local

1. Clonar el repositorio.
2. Abrir el proyecto mediante NetBeans o un editor compatible con desarrollo web.
3. Ejecutar la aplicación mediante un servidor web local.
4. Abrir el archivo `public_html/index.html` a través del servidor.
5. Iniciar sesión utilizando el PIN de prueba.

Se requiere conexión a Internet para cargar las bibliotecas externas utilizadas por la aplicación.

## Consideraciones de seguridad

Pokémon Bank es un simulador académico ejecutado del lado del cliente. Los mecanismos de autenticación y almacenamiento implementados tienen fines educativos y no representan mecanismos de seguridad adecuados para una aplicación bancaria real.

No se realizan operaciones financieras reales ni se utiliza información bancaria confidencial.

## Información académica

- Universidad Don Bosco.
- Ingeniería en Ciencias de la Computación.
- Lenguajes Interpretados en el Cliente.
- Proyecto Pokémon Bank.
- Fase 2.
- Año 2026.