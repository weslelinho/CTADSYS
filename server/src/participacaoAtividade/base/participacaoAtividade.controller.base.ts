/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/docs/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import * as defaultAuthGuard from "../../auth/defaultAuth.guard";
import { isRecordNotFoundError } from "../../prisma.util";
import * as errors from "../../errors";
import { Request } from "express";
import { plainToClass } from "class-transformer";
import { ApiNestedQuery } from "../../decorators/api-nested-query.decorator";
import { ParticipacaoAtividadeService } from "../participacaoAtividade.service";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { ParticipacaoAtividadeCreateInput } from "./ParticipacaoAtividadeCreateInput";
import { ParticipacaoAtividadeWhereInput } from "./ParticipacaoAtividadeWhereInput";
import { ParticipacaoAtividadeWhereUniqueInput } from "./ParticipacaoAtividadeWhereUniqueInput";
import { ParticipacaoAtividadeFindManyArgs } from "./ParticipacaoAtividadeFindManyArgs";
import { ParticipacaoAtividadeUpdateInput } from "./ParticipacaoAtividadeUpdateInput";
import { ParticipacaoAtividade } from "./ParticipacaoAtividade";
@swagger.ApiBearerAuth()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class ParticipacaoAtividadeControllerBase {
  constructor(
    protected readonly service: ParticipacaoAtividadeService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "create",
    possession: "any",
  })
  @common.Post()
  @swagger.ApiCreatedResponse({ type: ParticipacaoAtividade })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async create(
    @common.Body() data: ParticipacaoAtividadeCreateInput
  ): Promise<ParticipacaoAtividade> {
    return await this.service.create({
      data: {
        ...data,

        aluno: {
          connect: data.aluno,
        },

        tipoAtividade: {
          connect: data.tipoAtividade,
        },
      },
      select: {
        aluno: {
          select: {
            id: true,
          },
        },

        createdAt: true,
        data: true,
        id: true,

        tipoAtividade: {
          select: {
            id: true,
          },
        },

        updatedAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "read",
    possession: "any",
  })
  @common.Get()
  @swagger.ApiOkResponse({ type: [ParticipacaoAtividade] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(ParticipacaoAtividadeFindManyArgs)
  async findMany(
    @common.Req() request: Request
  ): Promise<ParticipacaoAtividade[]> {
    const args = plainToClass(ParticipacaoAtividadeFindManyArgs, request.query);
    return this.service.findMany({
      ...args,
      select: {
        aluno: {
          select: {
            id: true,
          },
        },

        createdAt: true,
        data: true,
        id: true,

        tipoAtividade: {
          select: {
            id: true,
          },
        },

        updatedAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "read",
    possession: "own",
  })
  @common.Get("/:id")
  @swagger.ApiOkResponse({ type: ParticipacaoAtividade })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async findOne(
    @common.Param() params: ParticipacaoAtividadeWhereUniqueInput
  ): Promise<ParticipacaoAtividade | null> {
    const result = await this.service.findOne({
      where: params,
      select: {
        aluno: {
          select: {
            id: true,
          },
        },

        createdAt: true,
        data: true,
        id: true,

        tipoAtividade: {
          select: {
            id: true,
          },
        },

        updatedAt: true,
      },
    });
    if (result === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "update",
    possession: "any",
  })
  @common.Patch("/:id")
  @swagger.ApiOkResponse({ type: ParticipacaoAtividade })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async update(
    @common.Param() params: ParticipacaoAtividadeWhereUniqueInput,
    @common.Body() data: ParticipacaoAtividadeUpdateInput
  ): Promise<ParticipacaoAtividade | null> {
    try {
      return await this.service.update({
        where: params,
        data: {
          ...data,

          aluno: {
            connect: data.aluno,
          },

          tipoAtividade: {
            connect: data.tipoAtividade,
          },
        },
        select: {
          aluno: {
            select: {
              id: true,
            },
          },

          createdAt: true,
          data: true,
          id: true,

          tipoAtividade: {
            select: {
              id: true,
            },
          },

          updatedAt: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }

  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "delete",
    possession: "any",
  })
  @common.Delete("/:id")
  @swagger.ApiOkResponse({ type: ParticipacaoAtividade })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async delete(
    @common.Param() params: ParticipacaoAtividadeWhereUniqueInput
  ): Promise<ParticipacaoAtividade | null> {
    try {
      return await this.service.delete({
        where: params,
        select: {
          aluno: {
            select: {
              id: true,
            },
          },

          createdAt: true,
          data: true,
          id: true,

          tipoAtividade: {
            select: {
              id: true,
            },
          },

          updatedAt: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }
}