import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ItemService } from './item_service';

// Solo traduce HTTP <-> servicio: ni reglas ni SQL.
@Controller('api/items')
export class ItemController {
  constructor(@Inject(ItemService) private readonly service: ItemService) {}

  @Get()
  list() {
    return this.service.list();
  }

  // Nest responde 201 por defecto en POST.
  @Post()
  create(@Body() body: { title?: unknown } | undefined) {
    return this.service.create(body?.title);
  }
}
