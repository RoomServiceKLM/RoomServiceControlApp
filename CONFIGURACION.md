# Room Service Control · configuración

## 1. Apps Script

1. Sustituye el contenido de `Code.gs` por el archivo corregido.
2. Ejecuta `installRoomServiceOperations()` una vez. No borra registros existentes.
3. En **Implementar > Gestionar implementaciones**, edita la aplicación web y crea una versión nueva.
4. Ejecutar como: **Yo**. Acceso: **Cualquier usuario**.
5. Copia la URL pública que termina exactamente en `/exec`.

No publiques una implementación nueva separada si ya existe la de producción: actualiza la existente para conservar su URL.

El instalador admite hojas de versiones anteriores. Si a `PickupRequests` u otra
hoja le faltan columnas, las añade al final sin mover cabeceras ni sobrescribir
registros existentes.

## 2. Panel interno

En `index.html`, sustituye solo:

```js
const API = 'PEGA_AQUI_LA_URL_DE_APPS_SCRIPT_EXEC';
```

por la URL `/exec` copiada en el paso anterior.

Publica juntos en GitHub Pages:

- `index.html`
- `manifest.json`
- `sw.js`
- `icon.svg`
- `kimpton-logo.svg`

La interfaz mantiene el mismo diseño y funcionamiento de la versión anterior:
acceso por usuario y contraseña, imagen Kimpton, estadísticas, actualización
automática cada cinco segundos, filtros, registro manual, entrega y recogidas.

## 3. Web de clientes

La web de clientes también debe dejar de apuntar al dominio antiguo de Cloudflare. Usa la función incluida en `conexion-clientes.js` o aplica en su código el mismo patrón: `text/plain`, `redirect: 'follow'` y la acción `createOrder`.

La comanda debe conservar como mínimo `room` e `items`; se recomienda mantener todos los campos actuales, incluido un `orderId` único para impedir duplicados.

## 4. Prueba segura

1. Ejecuta `crearComandaPruebaTelegram()` desde Apps Script.
2. Comprueba que aparece una fila en `Orders`, sus líneas en `OrderItems` y la copia en `Comandas`.
3. Abre el panel y confirma que la habitación 999 aparece como nueva.
4. Envía después un pedido de prueba desde la web de clientes.

No pruebes con una comanda real hasta completar estas cuatro comprobaciones.
