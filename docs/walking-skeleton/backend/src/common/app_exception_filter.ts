import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { ValidationError } from './validation_error';

// Tipo mínimo de la respuesta, para no depender de los tipos de express.
interface JsonResponse {
  status(code: number): { json(body: unknown): void };
}

// Único lugar donde los errores se convierten en respuestas HTTP:
// ValidationError -> 400, HttpException -> su propio código, el resto -> 500.
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<JsonResponse>();

    if (exception instanceof ValidationError) {
      response.status(400).json({ error: exception.message });
      return;
    }

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      response.status(exception.getStatus()).json(typeof body === 'string' ? { error: body } : body);
      return;
    }

    // Detalles solo al log: al cliente no se le filtra información interna.
    this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    response.status(500).json({ error: 'Error interno del servidor' });
  }
}
