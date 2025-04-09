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

## Estado actual del desarrollo

Se ha implementado una primera versión funcional de la API priorizando:

- **Flujo completo de creación y activación de tarjetas.**
- **Cambio de PIN.**
- **Creación de cuentas.**
- **Test unitarios de los servicios principales.**

El foco ha estado en garantizar el núcleo funcional y validar la lógica crítica de negocio, debido al tiempo limitado disponible.

## Endpoints implementados

| Método | Ruta                        | Descripción                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/api/accounts`             | Crear nueva cuenta                   |
| POST   | `/api/accounts/:id/cards`   | Crear tarjeta asociada a cuenta      |
| POST   | `/api/cards/:id/activate`   | Activar tarjeta (PIN inicial)        |
| PATCH  | `/api/cards/:id/change-pin` | Cambiar el PIN de una tarjeta activa |

## Testing

Se han implementado **test unitarios a nivel de servicio** para validar la lógica de negocio más crítica.

- `CardService`:
    - Creación de tarjetas.
    - Activación de tarjetas.
    - Cambio de PIN.
- `AccountService`:
    - Creación de cuentas.
- No se implementaron aún tests e2e ni unitarios de controladores por razones de tiempo.

## Mejoras futuras recomendadas

- Añadir tests e2e para validar integración completa.
- Añadir tests unitarios de controladores (más cercanos a la capa REST).
- Refactorizar y enriquecer el tipado en algunas funciones y mocks.
- Implementar endpoints restantes:
    - Consulta de movimientos de cuenta.
    - Ingreso de dinero.
    - Retirada de efectivo.
    - Transferencias bancarias.
    - Consulta y modificación del límite de tarjeta.
