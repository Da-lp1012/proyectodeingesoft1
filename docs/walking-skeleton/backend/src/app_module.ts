import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppExceptionFilter } from './common/app_exception_filter';
import { DbModule } from './db/db_module';
import { HealthModule } from './modules/health/health_module';
import { ItemModule } from './modules/items/item_module';

// Raíz de composición: une los módulos y registra el filtro de errores global.
@Module({
  imports: [DbModule, HealthModule, ItemModule],
  providers: [{ provide: APP_FILTER, useClass: AppExceptionFilter }],
})
export class AppModule {}
