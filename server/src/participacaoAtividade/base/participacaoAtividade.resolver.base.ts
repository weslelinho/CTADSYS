/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/docs/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as apollo from "apollo-server-express";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../../auth/gqlAC.guard";
import { isRecordNotFoundError } from "../../prisma.util";
import { MetaQueryPayload } from "../../util/MetaQueryPayload";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { CreateParticipacaoAtividadeArgs } from "./CreateParticipacaoAtividadeArgs";
import { UpdateParticipacaoAtividadeArgs } from "./UpdateParticipacaoAtividadeArgs";
import { DeleteParticipacaoAtividadeArgs } from "./DeleteParticipacaoAtividadeArgs";
import { ParticipacaoAtividadeFindManyArgs } from "./ParticipacaoAtividadeFindManyArgs";
import { ParticipacaoAtividadeFindUniqueArgs } from "./ParticipacaoAtividadeFindUniqueArgs";
import { ParticipacaoAtividade } from "./ParticipacaoAtividade";
import { Aluno } from "../../aluno/base/Aluno";
import { TipoAtividade } from "../../tipoAtividade/base/TipoAtividade";
import { ParticipacaoAtividadeService } from "../participacaoAtividade.service";

@graphql.Resolver(() => ParticipacaoAtividade)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class ParticipacaoAtividadeResolverBase {
  constructor(
    protected readonly service: ParticipacaoAtividadeService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.Query(() => MetaQueryPayload)
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "read",
    possession: "any",
  })
  async _participacaoAtividadesMeta(
    @graphql.Args() args: ParticipacaoAtividadeFindManyArgs
  ): Promise<MetaQueryPayload> {
    const results = await this.service.count({
      ...args,
      skip: undefined,
      take: undefined,
    });
    return {
      count: results,
    };
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => [ParticipacaoAtividade])
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "read",
    possession: "any",
  })
  async participacaoAtividades(
    @graphql.Args() args: ParticipacaoAtividadeFindManyArgs
  ): Promise<ParticipacaoAtividade[]> {
    return this.service.findMany(args);
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => ParticipacaoAtividade, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "read",
    possession: "own",
  })
  async participacaoAtividade(
    @graphql.Args() args: ParticipacaoAtividadeFindUniqueArgs
  ): Promise<ParticipacaoAtividade | null> {
    const result = await this.service.findOne(args);
    if (result === null) {
      return null;
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => ParticipacaoAtividade)
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "create",
    possession: "any",
  })
  async createParticipacaoAtividade(
    @graphql.Args() args: CreateParticipacaoAtividadeArgs
  ): Promise<ParticipacaoAtividade> {
    return await this.service.create({
      ...args,
      data: {
        ...args.data,

        aluno: {
          connect: args.data.aluno,
        },

        tipoAtividade: {
          connect: args.data.tipoAtividade,
        },
      },
    });
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => ParticipacaoAtividade)
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "update",
    possession: "any",
  })
  async updateParticipacaoAtividade(
    @graphql.Args() args: UpdateParticipacaoAtividadeArgs
  ): Promise<ParticipacaoAtividade | null> {
    try {
      return await this.service.update({
        ...args,
        data: {
          ...args.data,

          aluno: {
            connect: args.data.aluno,
          },

          tipoAtividade: {
            connect: args.data.tipoAtividade,
          },
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @graphql.Mutation(() => ParticipacaoAtividade)
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "delete",
    possession: "any",
  })
  async deleteParticipacaoAtividade(
    @graphql.Args() args: DeleteParticipacaoAtividadeArgs
  ): Promise<ParticipacaoAtividade | null> {
    try {
      return await this.service.delete(args);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.ResolveField(() => Aluno, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: "Aluno",
    action: "read",
    possession: "any",
  })
  async aluno(
    @graphql.Parent() parent: ParticipacaoAtividade
  ): Promise<Aluno | null> {
    const result = await this.service.getAluno(parent.id);

    if (!result) {
      return null;
    }
    return result;
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.ResolveField(() => TipoAtividade, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: "TipoAtividade",
    action: "read",
    possession: "any",
  })
  async tipoAtividade(
    @graphql.Parent() parent: ParticipacaoAtividade
  ): Promise<TipoAtividade | null> {
    const result = await this.service.getTipoAtividade(parent.id);

    if (!result) {
      return null;
    }
    return result;
  }
}