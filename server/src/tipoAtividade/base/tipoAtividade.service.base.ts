/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/docs/how-to/custom-code

------------------------------------------------------------------------------
  */
import { PrismaService } from "nestjs-prisma";
import { Prisma, TipoAtividade, ParticipacaoAtividade } from "@prisma/client";

export class TipoAtividadeServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async count<T extends Prisma.TipoAtividadeFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.TipoAtividadeFindManyArgs>
  ): Promise<number> {
    return this.prisma.tipoAtividade.count(args);
  }

  async findMany<T extends Prisma.TipoAtividadeFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.TipoAtividadeFindManyArgs>
  ): Promise<TipoAtividade[]> {
    return this.prisma.tipoAtividade.findMany(args);
  }
  async findOne<T extends Prisma.TipoAtividadeFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.TipoAtividadeFindUniqueArgs>
  ): Promise<TipoAtividade | null> {
    return this.prisma.tipoAtividade.findUnique(args);
  }
  async create<T extends Prisma.TipoAtividadeCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TipoAtividadeCreateArgs>
  ): Promise<TipoAtividade> {
    return this.prisma.tipoAtividade.create<T>(args);
  }
  async update<T extends Prisma.TipoAtividadeUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.TipoAtividadeUpdateArgs>
  ): Promise<TipoAtividade> {
    return this.prisma.tipoAtividade.update<T>(args);
  }
  async delete<T extends Prisma.TipoAtividadeDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.TipoAtividadeDeleteArgs>
  ): Promise<TipoAtividade> {
    return this.prisma.tipoAtividade.delete(args);
  }

  async findParticipacaoAtividades(
    parentId: string,
    args: Prisma.ParticipacaoAtividadeFindManyArgs
  ): Promise<ParticipacaoAtividade[]> {
    return this.prisma.tipoAtividade
      .findUnique({
        where: { id: parentId },
      })
      .participacaoAtividades(args);
  }
}
