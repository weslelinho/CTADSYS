import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { AlunoServiceBase } from "./base/aluno.service.base";

@Injectable()
export class AlunoService extends AlunoServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
