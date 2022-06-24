import { Module } from "@nestjs/common";
import { AlunoModuleBase } from "./base/aluno.module.base";
import { AlunoService } from "./aluno.service";
import { AlunoController } from "./aluno.controller";
import { AlunoResolver } from "./aluno.resolver";

@Module({
  imports: [AlunoModuleBase],
  controllers: [AlunoController],
  providers: [AlunoService, AlunoResolver],
  exports: [AlunoService],
})
export class AlunoModule {}
