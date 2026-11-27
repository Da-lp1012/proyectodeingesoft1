import { Module } from '@nestjs/common';
import { DbModule } from '../../db/db_module';
import { CardMoveService } from './card_move_service';
import { CompletionRule } from './completion_rule';

// Modulo Dashboard: por ahora registra la logica de negocio de RF-ARB-07 (tarea T2.1).
//
// Pendiente (no es parte de T2.1):
//  - La implementacion real del repositorio, PgCardRepository, es la tarea T1.2 (Silvana).
//    Cuando exista, se registra aqui el proveedor del token:
//      { provide: cardRepositoryToken, useClass: PgCardRepository }
//    y se agrega al arreglo de providers. En T2.2 se conecta y se verifica.
//  - BoardController (tarea de API, F3) se agregara al arreglo de controllers.
//
// Mientras el repositorio real no este registrado, este modulo no se importa todavia en
// AppModule: CardMoveService y CompletionRule se prueban de forma aislada (ver el test de
// esta carpeta, que inyecta un repositorio en memoria), sin afectar el arranque de la app.
@Module({
  imports: [DbModule],
  providers: [CompletionRule, CardMoveService],
  exports: [CardMoveService],
})
export class DashboardModule {}
