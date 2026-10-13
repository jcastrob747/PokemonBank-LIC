# Pokémon Bank

## Simulador Bancario Académico

Pokémon Bank es una aplicación web académica que simula las operaciones principales de un cajero automático (ATM).

El proyecto fue desarrollado como parte de la asignatura **Lenguajes Interpretados en el Cliente**, utilizando HTML5, CSS3, Bootstrap 4.6 y JavaScript.

Su objetivo es proporcionar una interfaz web intuitiva, funcional y adaptable para realizar operaciones bancarias simuladas utilizando los datos de una cuenta de prueba.

La aplicación incorpora ventanas interactivas mediante **SweetAlert2**, generación de comprobantes PDF mediante **jsPDF** y publicación automática mediante **GitHub Actions y GitHub Pages**.

### Aplicación publicada

**[Acceder al simulador Pokémon Bank](https://jcastrob747.github.io/PokemonBank-LIC/)**

---

## 1. Objetivo del proyecto

Desarrollar una aplicación web que permita simular las principales operaciones de un cajero automático mediante tecnologías de desarrollo web del lado del cliente.

El simulador permite:

- Iniciar sesión mediante un PIN de cuatro dígitos.
- Consultar información bancaria.
- Realizar depósitos y retiros simulados.
- Consultar el saldo disponible.
- Pagar servicios básicos.
- Consultar el historial de transacciones.
- Visualizar estadísticas bancarias.
- Descargar comprobantes PDF de las operaciones realizadas.

---

## 2. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| HTML5 | Estructura de las páginas web. |
| CSS3 | Diseño visual y estilos personalizados. |
| Bootstrap 4.6 | Diseño adaptable a diferentes pantallas. |
| JavaScript | Lógica de las operaciones bancarias. |
| SweetAlert2 | Ventanas interactivas de confirmación y notificación. |
| jsPDF | Generación de comprobantes bancarios en PDF. |
| SVG | Representación de gráficos estadísticos. |
| LocalStorage | Almacenamiento de saldos y transacciones. |
| SessionStorage | Administración de sesiones. |
| Git | Control de versiones. |
| GitHub | Alojamiento del repositorio. |
| GitHub Actions | Automatización del despliegue. |
| GitHub Pages | Publicación de la aplicación web. |
| Apache NetBeans | Entorno de desarrollo. |

La lógica principal del simulador está desarrollada con JavaScript del lado del cliente, sin utilizar frameworks de JavaScript.

---

## 3. Funcionalidades

### 3.1. Inicio de sesión

- Acceso mediante PIN de cuatro dígitos.
- Validación del PIN ingresado.
- Administración de sesiones.
- Protección de las páginas internas.
- Cierre de sesión.

### 3.2. Menú principal

- Información del titular.
- Número de cuenta.
- Tipo de cuenta.
- Acceso a las operaciones bancarias.

### 3.3. Depósitos

- Registro de depósitos.
- Validación de montos.
- Actualización del saldo.
- Registro automático en el historial.
- Confirmaciones mediante SweetAlert2.
- Generación de comprobantes PDF.

### 3.4. Retiros

- Registro de retiros.
- Validación de fondos disponibles.
- Actualización del saldo.
- Registro automático de transacciones.
- Confirmaciones mediante SweetAlert2.
- Generación de comprobantes PDF.

### 3.5. Consulta de saldo

- Visualización del saldo disponible.
- Actualización automática después de las operaciones.

### 3.6. Pago de servicios

Servicios disponibles:

- Energía eléctrica.
- Internet.
- Telefonía.
- Agua potable.

El módulo permite registrar referencias de pago, validar montos y actualizar el saldo disponible.

También incorpora:

- Confirmación del pago mediante SweetAlert2.
- Mensajes de operación exitosa.
- Validación de fondos suficientes.
- Protección del contenido dinámico mostrado en ventanas HTML.
- Generación de comprobantes PDF.
- Registro de las operaciones en el historial.

### 3.7. Historial de transacciones

- Consulta de depósitos.
- Consulta de retiros.
- Consulta de pagos de servicios.
- Visualización de fechas y montos.
- Clasificación de operaciones por tipo.
- Conservación de movimientos mediante LocalStorage.

### 3.8. Estadísticas bancarias

- Total de transacciones.
- Total de depósitos.
- Total de retiros.
- Total de pagos de servicios.
- Gráfico de distribución de operaciones.
- Gráfico comparativo de montos.

Los gráficos se generan dinámicamente mediante JavaScript y SVG.

---

## 4. Bibliotecas externas

### 4.1. SweetAlert2

SweetAlert2 permite sustituir las ventanas tradicionales de JavaScript por cuadros de diálogo interactivos y personalizables.

En Pokémon Bank se utiliza para:

- Solicitar confirmación antes de realizar operaciones.
- Mostrar mensajes de transacciones exitosas.
- Presentar información de los movimientos bancarios.
- Ofrecer opciones para descargar comprobantes PDF.

La biblioteca se incorpora mediante CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```

### 4.2. jsPDF

jsPDF permite crear documentos PDF directamente desde el navegador mediante JavaScript.

En Pokémon Bank se utiliza para generar comprobantes bancarios correspondientes a:

- Depósitos.
- Retiros.
- Pagos de servicios.

La biblioteca se incorpora mediante CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js"></script>
```

El archivo `comprobantes.js` centraliza la generación de los documentos.

### 4.3. Información de los comprobantes

Los comprobantes PDF incluyen:

- Nombre del simulador.
- Número de comprobante.
- Fecha y hora.
- Titular de la cuenta.
- Número de cuenta.
- Tipo de cuenta.
- Tipo de operación.
- Descripción de la transacción.
- Monto de la operación.
- Saldo resultante.
- Aviso indicando que se trata de una simulación académica.

En los pagos de servicios, la descripción permite identificar el servicio pagado y su referencia.

Los documentos se descargan automáticamente cuando el usuario selecciona la opción correspondiente.

---

## 5. Estructura del proyecto

```text
PokemonBank-LIC/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── public_html/
│   │
│   ├── css/
│   │   └── styles.css
│   │
│   ├── images/
│   │   └── favicon.svg
│   │
│   ├── js/
│   │   ├── banco.js
│   │   ├── comprobantes.js
│   │   ├── deposito.js
│   │   ├── retiro.js
│   │   ├── saldo.js
│   │   ├── servicios.js
│   │   ├── historial.js
│   │   ├── estadisticas.js
│   │   ├── login.js
│   │   └── sesion.js
│   │
│   ├── index.html
│   ├── dashboard.html
│   ├── deposito.html
│   ├── retiro.html
│   ├── saldo.html
│   ├── servicios.html
│   ├── historial.html
│   └── estadisticas.html
│
├── nbproject/
├── README.md
├── .gitignore
├── .bowerrc
├── bower.json
├── Gruntfile.js
├── gulpfile.js
└── package.json
```

---

## 6. Funcionamiento del sistema

El simulador utiliza un saldo inicial de prueba de **$2,500.00**.

Las operaciones bancarias modifican el saldo disponible y registran automáticamente los movimientos realizados.

Los datos se almacenan mediante **LocalStorage**, permitiendo conservar las transacciones al actualizar o cerrar el navegador.

La sesión del usuario se administra mediante **SessionStorage**.

El sistema funciona completamente del lado del cliente y no requiere una base de datos.

### Procesamiento de operaciones

El funcionamiento general es:

1. El usuario inicia sesión.
2. Selecciona una operación bancaria.
3. Introduce los datos solicitados.
4. El sistema valida la información.
5. SweetAlert2 solicita la confirmación.
6. JavaScript procesa la operación.
7. Se actualiza el saldo y se registra la transacción.
8. SweetAlert2 presenta el resultado.
9. El usuario puede descargar un comprobante PDF mediante jsPDF.

---

## 7. Instrucciones de ejecución

### 7.1. Ejecución desde NetBeans

1. Descargar o clonar el repositorio.
2. Abrir el proyecto en Apache NetBeans.
3. Ejecutar el archivo `index.html`.
4. Ingresar el PIN de prueba configurado.
5. Acceder al menú principal.
6. Seleccionar la operación bancaria deseada.

También es posible ejecutar la aplicación mediante un servidor web local.

### 7.2. Ejecución desde Internet

La aplicación está publicada mediante GitHub Pages.

**Dirección:**

https://jcastrob747.github.io/PokemonBank-LIC/

Para utilizarla:

1. Abrir la dirección en un navegador.
2. Ingresar el PIN de prueba configurado.
3. Acceder al menú principal.
4. Seleccionar la operación bancaria.
5. Realizar las transacciones simuladas.

La aplicación no necesita instalarse en la computadora del usuario.

**Nota:** Las bibliotecas cargadas mediante CDN requieren conexión a Internet.

---

## 8. Diseño adaptable

La aplicación utiliza Bootstrap 4.6 y CSS3.

Las interfaces fueron diseñadas para adaptarse a diferentes resoluciones de pantalla.

Se realizaron pruebas de visualización en computadoras y dispositivos móviles mediante las herramientas de desarrollo de Google Chrome.

También se verificó la visualización de ventanas SweetAlert2 y gráficos estadísticos en resoluciones móviles.

---

## 9. Control de versiones

El proyecto utiliza Git para administrar las versiones del código fuente.

El repositorio remoto se encuentra alojado en GitHub.

**Rama principal:** `main`.

Las modificaciones se registran mediante commits para mantener un historial organizado del desarrollo.

Durante la implementación de SweetAlert2 y jsPDF se modificaron los módulos de depósitos, retiros y pagos de servicios.

También se incorporó el archivo `comprobantes.js`.

Posteriormente, los cambios se sincronizaron mediante operaciones Git de Commit, Merge y Push desde Apache NetBeans.

---

## 10. GitHub Actions y GitHub Pages

Pokémon Bank utiliza GitHub Actions para automatizar su publicación.

El flujo de trabajo se encuentra en:

```text
.github/workflows/deploy.yml
```

### Funcionamiento del despliegue

Cuando se envían cambios a la rama `main`:

1. GitHub Actions detecta el nuevo commit.
2. Descarga el contenido del repositorio.
3. Configura GitHub Pages.
4. Prepara los archivos ubicados en `public_html`.
5. Publica la aplicación automáticamente.

Este procedimiento permite mantener la estructura original del proyecto de NetBeans.

### Sitio publicado

https://jcastrob747.github.io/PokemonBank-LIC/

La publicación utiliza HTTPS.

---

## 11. Pruebas funcionales

Se realizaron pruebas para comprobar el funcionamiento de las principales operaciones.

### 11.1. Depósitos y retiros

Se verificaron:

- Validación de montos.
- Actualización del saldo.
- Registro en el historial.
- Ventanas de confirmación.
- Generación de comprobantes PDF.

### 11.2. Pago de servicios

Se realizaron las siguientes operaciones de prueba:

| Servicio | Referencia | Monto |
|---|---|---:|
| Energía eléctrica | 123456789 | $15.00 |
| Telefonía | 504 | $1.00 |

Los pagos se procesaron correctamente.

### 11.3. Verificación de saldos

Saldo antes del primer pago:

**$1,430.00**

Después del pago de energía eléctrica:

**$1,415.00**

Después del pago de telefonía:

**$1,414.00**

Las operaciones reflejaron correctamente la disminución del saldo.

### 11.4. Historial y estadísticas

Se verificó que ambos pagos aparecieran registrados en el historial.

El módulo de estadísticas presentó:

| Tipo de operación | Cantidad | Porcentaje |
|---|---:|---:|
| Depósitos | 3 | 30 % |
| Retiros | 3 | 30 % |
| Servicios | 4 | 40 % |
| Total | 10 | 100 % |

### 11.5. Publicación

Se verificó que la aplicación publicada mediante GitHub Pages funciona con los cambios sincronizados desde NetBeans.

---

## 12. Consideraciones académicas

Pokémon Bank es un simulador desarrollado exclusivamente con fines educativos.

No se realizan operaciones bancarias reales.

Los saldos, movimientos y datos de cuenta corresponden a información simulada.

La autenticación mediante PIN es una implementación académica del lado del cliente y no constituye un mecanismo de seguridad adecuado para aplicaciones bancarias reales.

La información almacenada mediante LocalStorage y SessionStorage pertenece al entorno del navegador y no representa un sistema bancario centralizado.

Los comprobantes PDF generados son documentos de demostración sin validez bancaria.

---

## 13. Autor

Proyecto académico desarrollado para la asignatura:

**Lenguajes Interpretados en el Cliente**

Año: **2026**.
