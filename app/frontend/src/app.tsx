import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { createItem, getHealth, type Item, listItems } from './api';

type LayerState = 'checking' | 'up' | 'down';

const stateLabels: Record<LayerState, string> = {
  checking: 'Verificando…',
  up: 'Conectado',
  down: 'Sin conexión',
};

const healthRefreshMs = 5000;

function StatusCard({ name, state }: { name: string; state: LayerState }) {
  return (
    <div className={`status-card status-${state}`}>
      <span className="status-dot" aria-hidden="true" />
      <div>
        <div className="status-name">{name}</div>
        <div className="status-label">{stateLabels[state]}</div>
      </div>
    </div>
  );
}

export function App() {
  const [apiState, setApiState] = useState<LayerState>('checking');
  const [dbState, setDbState] = useState<LayerState>('checking');
  const [items, setItems] = useState<Item[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setItems(await listItems());
      setListError(null);
    } catch (error) {
      setListError((error as Error).message);
    }
  }, []);

  // Refresca el estado cada pocos segundos para ver caídas y recuperaciones sin recargar.
  useEffect(() => {
    let active = true;
    async function checkHealth() {
      try {
        const health = await getHealth();
        if (!active) return;
        setApiState('up');
        setDbState(health.database);
        if (health.database === 'up') void loadItems();
      } catch {
        if (!active) return;
        // Si la API no responde no sabemos nada de la base: se muestra también sin conexión.
        setApiState('down');
        setDbState('down');
      }
    }
    void checkHealth();
    const timer = setInterval(checkHealth, healthRefreshMs);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [loadItems]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      await createItem(title);
      setTitle('');
      await loadItems();
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="layout">
      {/* Cabecera de página */}
      <header className="topbar">
        <h1>Slackless</h1>
        <p className="subtitle">Walking skeleton: interfaz → API → base de datos</p>
      </header>

      {/* Barra lateral: estado de las 3 capas siempre visible */}
      <aside className="sidebar">
        <section aria-labelledby="estado-titulo">
          <h2 id="estado-titulo">Estado del sistema</h2>
          <div className="status-grid">
            {/* El frontend siempre está "conectado": si no, esta página no se vería. */}
            <StatusCard name="Frontend" state="up" />
            <StatusCard name="API" state={apiState} />
            <StatusCard name="Base de datos" state={dbState} />
          </div>
        </section>
      </aside>

      {/* Área principal: formulario y lista */}
      <main className="content">
      <section aria-labelledby="items-titulo">
        <h2 id="items-titulo">Mensajes</h2>

        <form className="item-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Escribe un mensaje"
            aria-label="Escribe un mensaje"
            maxLength={120}
          />
          <button type="submit" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </form>
        {formError && (
          <p className="error" role="alert">
            {formError}
          </p>
        )}

        {listError && (
          <p className="error" role="alert">
            {listError}
          </p>
        )}
        {items.length === 0 && !listError ? (
          <p className="empty">Todavía no hay mensajes guardados.</p>
        ) : (
          <ul className="item-list">
            {items.map((item) => (
              <li key={item.id}>
                <span className="item-title">{item.title}</span>
                <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString('es-CO')}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
      </main>
    </div>
  );
}
