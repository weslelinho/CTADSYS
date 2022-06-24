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
import { OcorrenciaService } from "../ocorrencia.service";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { OcorrenciaCreateInput } from "./OcorrenciaCreateInput";
import { OcorrenciaWhereInput } from "./OcorrenciaWhereInput";
import { OcorrenciaWhereUniqueInput } from "./OcorrenciaWhereUniqueInput";
import { OcorrenciaFindManyArgs } from "./OcorrenciaFindManyArgs";
import { OcorrenciaUpdateInput } from "./OcorrenciaUpdateInput";
import { Ocorrencia } from "./Ocorrencia";
import { AlunoFindManyArgs } from "../../aluno/base/AlunoFindManyArgs";
import { Aluno } from "../../aluno/base/Aluno";
import { AlunoWhereUniqueInput } from "../../aluno/base/AlunoWhereUniqueInput";
@swagger.ApiBearerAuth()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class OcorrenciaControllerBase {
  constructor(
    protected readonly service: OcorrenciaService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Ocorrencia",
    action: "create",
    possession: "any",
  })
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Ocorrencia })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async create(
    @common.Body() data: OcorrenciaCreateInput
  ): Promise<Ocorrencia> {
    return await this.service.create({
      data: data,
      select: {
        createdAt: true,
        descricao: true,
        id: true,
        tipo: true,
        updatedAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Ocorrencia",
    action: "read",
    possession: "any",
  })
  @common.Get()
  @swagger.ApiOkResponse({ type: [Ocorrencia] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(OcorrenciaFindManyArgs)
  async findMany(@common.Req() request: Request): Promise<Ocorrencia[]> {
    const args = plainToClass(OcorrenciaFindManyArgs, request.query);
    return this.service.findMany({
      ...args,
      select: {
        createdAt: true,
        descricao: true,
        id: true,
        tipo: true,
        updatedAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Ocorrencia",
    action: "read",
    possession: "own",
  })
  @common.Get("/:id")
  @swagger.ApiOkResponse({ type: Ocorrencia })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async findOne(
    @common.Param() params: OcorrenciaWhereUniqueInput
  ): Promise<Ocorrencia | null> {
    const result = await this.service.findOne({
      where: params,
      select: {
        createdAt: true,
        descricao: true,
        id: true,
        tipo: true,
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
    resource: "Ocorrencia",
    action: "update",
    possession: "any",
  })
  @common.Patch("/:id")
  @swagger.ApiOkResponse({ type: Ocorrencia })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async update(
    @common.Param() params: OcorrenciaWhereUniqueInput,
    @common.Body() data: OcorrenciaUpdateInput
  ): Promise<Ocorrencia | null> {
    try {
      return await this.service.update({
        where: params,
        data: data,
        select: {
          createdAt: true,
          descricao: true,
          id: true,
          tipo: true,
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
    resource: "Ocorrencia",
    action: "delete",
    possession: "any",
  })
  @common.Delete("/:id")
  @swagger.ApiOkResponse({ type: Ocorrencia })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async delete(
    @common.Param() params: OcorrenciaWhereUniqueInput
  ): Promise<Ocorrencia | null> {
    try {
      return await this.service.delete({
        where: params,
        select: {
          createdAt: true,
          descricao: true,
          id: true,
          tipo: true,
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

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Aluno",
    action: "read",
    possession: "any",
  })
  @common.Get("/:id/alunos")
  @ApiNestedQuery(AlunoFindManyArgs)
  async findManyAlunos(
    @common.Req() request: Request,
    @common.Param() params: OcorrenciaWhereUniqueInput
  ): Promise<Aluno[]> {
    const query = plainToClass(AlunoFindManyArgs, request.query);
    const results = await this.service.findAlunos(params.id, {
      ...query,
      select: {
        cidade: true,
        cpf: true,
        createdAt: true,
        dataEmissaoRg: true,
        dataNascimento: true,
        dataSaida: true,
        endereco: true,
        filiacaoMae: true,
        filiacaoPai: true,
        id: true,
        idadeInicioDroga: true,
        matricula: true,
        nome: true,
        outraClinica: true,
        possuiDoenca: true,
        processo: true,
        profissao: true,
        regulamento: true,
        religiao: true,
        rg: true,
        rgOrgaoExpedidor: true,
        secao: true,
        sexo: true,
        tempoInternacao: true,
        tiposDrogas: true,
        tituloEleitor: true,
        uf: true,
        updatedAt: true,
        zona: true,
      },
    });
    if (results === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return results;
  }

  @nestAccessControl.UseRoles({
    resource: "Ocorrencia",
    action: "update",
    possession: "any",
  })
  @common.Post("/:id/alunos")
  async connectAlunos(
    @common.Param() params: OcorrenciaWhereUniqueInput,
    @common.Body() body: AlunoWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      alunos: {
        connect: body,
      },
    };
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }

  @nestAccessControl.UseRoles({
    resource: "Ocorrencia",
    action: "update",
    possession: "any",
  })
  @common.Patch("/:id/alunos")
  async updateAlunos(
    @common.Param() params: OcorrenciaWhereUniqueInput,
    @common.Body() body: AlunoWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      alunos: {
        set: body,
      },
    };
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }

  @nestAccessControl.UseRoles({
    resource: "Ocorrencia",
    action: "update",
    possession: "any",
  })
  @common.Delete("/:id/alunos")
  async disconnectAlunos(
    @common.Param() params: OcorrenciaWhereUniqueInput,
    @common.Body() body: AlunoWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      alunos: {
        disconnect: body,
      },
    };
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }
}
