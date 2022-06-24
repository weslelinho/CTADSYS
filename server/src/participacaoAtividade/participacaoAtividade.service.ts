import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { ParticipacaoAtividadeServiceBase } from "./base/participacaoAtividade.service.base";

@Injectable()
export class ParticipacaoAtividadeService extends ParticipacaoAtividadeServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
