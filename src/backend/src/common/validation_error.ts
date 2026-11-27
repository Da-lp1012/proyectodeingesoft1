// Error de regla de negocio. Vive aparte de HTTP: el servicio lo lanza sin saber
// de códigos de estado, y el filtro de excepciones lo traduce a 400.
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
