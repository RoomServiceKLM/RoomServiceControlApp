/* Sustituye la conexión antigua de Cloudflare de la web de clientes por esta. */
const ROOM_SERVICE_API_URL = 'PEGA_AQUI_LA_URL_DE_APPS_SCRIPT_EXEC';

async function enviarPedidoRoomService(pedido) {
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(ROOM_SERVICE_API_URL)) {
    throw new Error('Falta configurar la URL /exec de Apps Script.');
  }

  const response = await fetch(ROOM_SERVICE_API_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'createOrder', order: pedido })
  });
  const text = await response.text();
  let result;
  try { result = JSON.parse(text); }
  catch (error) { throw new Error('Apps Script devolvió una respuesta no válida.'); }
  if (!result.ok) throw new Error(result.error || 'No se pudo registrar el pedido.');
  return result;
}
