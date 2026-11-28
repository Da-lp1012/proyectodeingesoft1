import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db_module';
import { HealthController } from './health_controller';

@Module({
  imports: [DbModule],
  controllers: [HealthController],
})
export class HealthModule {}
