# API del Sistema ATM

Una **API REST** desarrollada con **Nest.js** para simular las operaciones disponibles en un cajero automático: transacciones de cuentas, gestión de tarjetas y transferencias entre cuentas. Esta API proporciona una base segura y escalable para sistemas bancarios, ofreciendo una arquitectura modular y extensible. Perfecta para simular un entorno de cajero automático o integrarse en un sistema financiero más grande.

## 🚀 Tecnologías utilizadas

- **Nest.js**: Framework para construir aplicaciones de servidor eficientes y escalables.
- **TypeORM**: ORM para trabajar con bases de datos SQL, en este caso, MySQL.
- **bcrypt**: Para cifrado seguro de PINs.
- **class-validator y class-transformer**: Validaciones y transformaciones de los datos de entrada.
- **Jest**: Herramienta de pruebas unitarias para garantizar la fiabilidad del sistema.
- **Swagger**: Documentación interactiva de la API para facilitar su uso.

## ⚙️ Instalación y Configuración

1. **Clonar el repositorio**:

    ```bash
    git clone git@github.com:davidlosasgonzalez/atm-system.git
    cd atm-system
    ```

2. **Instalar dependencias**:

    ```bash
    npm install
    ```

3. **Configurar el entorno**:
   Copia `.env.example` a `.env` y completa los campos necesarios.

4. **Ejecutar la aplicación**:
   Para desarrollo:

    ```bash
    npm run start:dev
    ```

    Para producción:

    ```bash
    npm run build
    npm run start:prod
    ```

## 🗃️ Modelo de Datos

### Cuentas (`accounts`)

| Campo        | Tipo       | Descripción                                     |
| ------------ | ---------- | ----------------------------------------------- |
| `id`         | `uuid`     | Identificador único para la cuenta.             |
| `iban`       | `string`   | Número de cuenta bancaria internacional (IBAN). |
| `balance`    | `decimal`  | Saldo actual de la cuenta.                      |
| `created_at` | `datetime` | Fecha y hora de creación de la cuenta.          |

### Tarjetas (`cards`)

| Campo              | Tipo       | Descripción                                               |
| ------------------ | ---------- | --------------------------------------------------------- |
| `id`               | `uuid`     | Identificador único para la tarjeta.                      |
| `account_id`       | `uuid`     | Referencia a la cuenta asociada.                          |
| `number`           | `string`   | Número de la tarjeta (generado).                          |
| `pin`              | `string`   | PIN cifrado (opcional hasta la activación de la tarjeta). |
| `is_active`        | `boolean`  | Estado de activación de la tarjeta.                       |
| `card_type`        | `enum`     | 'debit' o 'credit'.                                       |
| `withdrawal_limit` | `int`      | Límite diario de retiro (entre 500€ y 6000€).             |
| `credit_limit`     | `int`      | Límite de crédito (solo para tarjetas de crédito).        |
| `created_at`       | `datetime` | Fecha y hora de creación de la tarjeta.                   |

### Transacciones (`transactions`)

| Campo         | Tipo       | Descripción                                           |
| ------------- | ---------- | ----------------------------------------------------- |
| `id`          | `uuid`     | Identificador único para la transacción.              |
| `account_id`  | `uuid`     | Identificador de la cuenta asociada.                  |
| `type`        | `enum`     | Tipo de transacción: depósito, retiro, transferencia. |
| `amount`      | `decimal`  | Monto de dinero involucrado en la transacción.        |
| `description` | `string`   | Descripción de la transacción.                        |
| `created_at`  | `datetime` | Fecha y hora en que se realizó la transacción.        |

## 🔚 Endpoints de la API

### Cuentas (`/accounts`)

- **`POST /api/accounts`**: Crear una nueva cuenta. ✅
- **`GET /api/accounts/:id/transactions`**: Ver transacciones de una cuenta.

### Tarjetas (`/cards`)

- **`POST /api/accounts/:accountId/cards`**: Crear una tarjeta para una cuenta. ✅
- **`PUT /api/cards/:cardId/activate`**: Activar una tarjeta con un PIN. ✅
- **`PATCH /api/cards/:cardId/pin`**: Cambiar el PIN de una tarjeta activa. ✅
- **`GET /api/cards/:cardId/config`**: Ver configuración de la tarjeta (límite de retiro).
- **`PATCH /api/cards/:cardId/config`**: Modificar el límite de retiro.

### Transacciones (`/transactions`)

- **`POST /api/accounts/:id/transactions/withdraw`**: Retirar dinero de una cuenta.
- **`POST /api/accounts/:id/transactions/deposit`**: Depositar dinero en una cuenta (misma entidad).
- **`POST /api/accounts/:id/transactions/transfer`**: Transferir dinero entre cuentas.

## 🧪 Ejecutar Tests

Ejecutar tests unitarios (servicios y controladores):

```bash
npm run test:unit:services
npm run test:unit:controllers
```
