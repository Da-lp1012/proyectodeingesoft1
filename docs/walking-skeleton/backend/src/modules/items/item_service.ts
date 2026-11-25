import { Inject, Injectable } from '@nestjs/common';
import { ValidationError } from '../../common/validation_error';
import { Item } from './item_model';
import { ItemRepository, itemRepositoryToken } from './item_repository';

const maxTitleLength = 120;

// Reglas de negocio. No sabe de HTTP ni de SQL: depende de la interfaz del repositorio.
@Injectable()
export class ItemService {
  constructor(@Inject(itemRepositoryToken) private readonly repository: ItemRepository) {}

  list(): Promise<Item[]> {
    return this.repository.findAll();
  }

  // Recibe unknown porque viene directo del cuerpo de la petición, sin garantías de tipo.
  create(rawTitle: unknown): Promise<Item> {
    if (typeof rawTitle !== 'string' || rawTitle.trim() === '') {
      throw new ValidationError('El mensaje es obligatorio');
    }
    const title = rawTitle.trim();
    if (title.length > maxTitleLength) {
      throw new ValidationError(`El mensaje no puede superar los ${maxTitleLength} caracteres`);
    }
    return this.repository.create({ title });
  }
}
