import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { TipoAtividadeServiceBase } from "./base/tipoAtividade.service.base";

@Injectable()
export class TipoAtividadeService extends TipoAtividadeServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
