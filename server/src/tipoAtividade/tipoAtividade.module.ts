import { Module } from "@nestjs/common";
import { TipoAtividadeModuleBase } from "./base/tipoAtividade.module.base";
import { TipoAtividadeService } from "./tipoAtividade.service";
import { TipoAtividadeController } from "./tipoAtividade.controller";
import { TipoAtividadeResolver } from "./tipoAtividade.resolver";

@Module({
  imports: [TipoAtividadeModuleBase],
  controllers: [TipoAtividadeController],
  providers: [TipoAtividadeService, TipoAtividadeResolver],
  exports: [TipoAtividadeService],
})
export class TipoAtividadeModule {}
