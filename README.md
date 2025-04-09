# Cajero API

API REST desarrollada con Nest.js para simular las operaciones disponibles en un cajero automático: consultas de movimientos, operaciones con tarjetas y transacciones entre cuentas.

## Modelo de datos

### Cuenta (`accounts`)

- `id`
- `iban`
- `balance`
- `created_at`

### Tarjeta (`cards`)

- `id`
- `account_id`
- `number`
- `pin`: código cifrado.
- `is_active`
- `card_type`: débito o crédito.
- `withdrawal_limit`: límite diario de retirada entre 500€ y 6000€.
- `credit_limit`: solo para tarjetas de crédito. Permite retirar sin saldo hasta el límite establecido.
- `created_at`

### Movimiento (`transactions`)

- `id`
- `account_id`
- `type`: ingreso, retirada, transferencia recibida / enviada, comisión.
- `amount`
- `description`
- `created_at`

## Endpoints principales

### Cuentas (`/accounts`)

- `POST /api/accounts`: Crear una cuenta nueva
- `GET /api/accounts/:id/transactions`: Ver movimientos de una cuenta

### Tarjetas (`/cards`)

- `POST /api/accounts/:accountId/cards`: Crear una tarjeta para una cuenta
- `PUT /api/cards/:cardId/activate`: Activar tarjeta con PIN
- `PATCH /api/cards/:cardId/pin`: Cambiar el PIN
- `GET /api/cards/:cardId/config`: Ver configuración (límite)
- `PATCH /api/cards/:cardId/config`: Modificar límite de retirada

### Transacciones (`/transactions`)

- `POST /api/accounts/:id/transactions/withdraw`: Retirar dinero
- `POST /api/accounts/:id/transactions/deposit`: Ingresar dinero (mismo banco)
- `POST /api/accounts/:id/transactions/transfer`: Hacer una transferencia

## Requisitos técnicos

- Uso de Git con buenas prácticas.
- Tests unitarios y de integración.
- Cifrado seguro del PIN.
- Validaciones y manejo de errores.
