// Único archivo del frontend que habla con la API. Rutas relativas: el proxy de Vite hace el resto.

export interface Item {
  id: number;
  title: string;
  createdAt: string;
}

export interface Health {
  status: string;
  api: 'up';
  database: 'up' | 'down';
  timestamp: string;
}

// /api/health responde 503 (con cuerpo JSON) cuando la base está caída; ese cuerpo también es útil.
// Si la API no responde, el proxy devuelve un error sin ese formato y aquí se lanza una excepción.
export async function getHealth(): Promise<Health> {
  const response = await fetch('/api/health');
  const body = (await response.json()) as Health;
  if (body.api !== 'up') throw new Error('Respuesta de salud inválida');
  return body;
}

export async function listItems(): Promise<Item[]> {
  const response = await fetch('/api/items');
  if (!response.ok) throw new Error('No se pudo cargar la lista');
  return (await response.json()) as Item[];
}

export async function createItem(title: string): Promise<Item> {
  const response = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    // La API manda { error } en los 400; se muestra tal cual al usuario.
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'No se pudo guardar el mensaje');
  }
  return (await response.json()) as Item;
}
