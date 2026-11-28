import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db_module';
import { ItemController } from './item_controller';
import { PgItemRepository, itemRepositoryToken } from './item_repository';
import { ItemService } from './item_service';

@Module({
  imports: [DbModule],
  controllers: [ItemController],
  providers: [
    ItemService,
    // Aquí se decide qué implementación del repositorio usa la app (los tests la reemplazan).
    { provide: itemRepositoryToken, useClass: PgItemRepository },
  ],
})
export class ItemModule {}
