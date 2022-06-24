import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { OcorrenciaServiceBase } from "./base/ocorrencia.service.base";

@Injectable()
export class OcorrenciaService extends OcorrenciaServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
