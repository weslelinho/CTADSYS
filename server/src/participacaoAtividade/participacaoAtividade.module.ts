import { Module } from "@nestjs/common";
import { ParticipacaoAtividadeModuleBase } from "./base/participacaoAtividade.module.base";
import { ParticipacaoAtividadeService } from "./participacaoAtividade.service";
import { ParticipacaoAtividadeController } from "./participacaoAtividade.controller";
import { ParticipacaoAtividadeResolver } from "./participacaoAtividade.resolver";

@Module({
  imports: [ParticipacaoAtividadeModuleBase],
  controllers: [ParticipacaoAtividadeController],
  providers: [ParticipacaoAtividadeService, ParticipacaoAtividadeResolver],
  exports: [ParticipacaoAtividadeService],
})
export class ParticipacaoAtividadeModule {}
