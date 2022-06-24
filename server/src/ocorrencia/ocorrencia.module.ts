import { Module } from "@nestjs/common";
import { OcorrenciaModuleBase } from "./base/ocorrencia.module.base";
import { OcorrenciaService } from "./ocorrencia.service";
import { OcorrenciaController } from "./ocorrencia.controller";
import { OcorrenciaResolver } from "./ocorrencia.resolver";

@Module({
  imports: [OcorrenciaModuleBase],
  controllers: [OcorrenciaController],
  providers: [OcorrenciaService, OcorrenciaResolver],
  exports: [OcorrenciaService],
})
export class OcorrenciaModule {}
