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
import { AlunoService } from "../aluno.service";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AlunoCreateInput } from "./AlunoCreateInput";
import { AlunoWhereInput } from "./AlunoWhereInput";
import { AlunoWhereUniqueInput } from "./AlunoWhereUniqueInput";
import { AlunoFindManyArgs } from "./AlunoFindManyArgs";
import { AlunoUpdateInput } from "./AlunoUpdateInput";
import { Aluno } from "./Aluno";
import { OcorrenciaFindManyArgs } from "../../ocorrencia/base/OcorrenciaFindManyArgs";
import { Ocorrencia } from "../../ocorrencia/base/Ocorrencia";
import { OcorrenciaWhereUniqueInput } from "../../ocorrencia/base/OcorrenciaWhereUniqueInput";
import { ParticipacaoAtividadeFindManyArgs } from "../../participacaoAtividade/base/ParticipacaoAtividadeFindManyArgs";
import { ParticipacaoAtividade } from "../../participacaoAtividade/base/ParticipacaoAtividade";
import { ParticipacaoAtividadeWhereUniqueInput } from "../../participacaoAtividade/base/ParticipacaoAtividadeWhereUniqueInput";
@swagger.ApiBearerAuth()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class AlunoControllerBase {
  constructor(
    protected readonly service: AlunoService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Aluno",
    action: "create",
    possession: "any",
  })
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Aluno })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async create(@common.Body() data: AlunoCreateInput): Promise<Aluno> {
    return await this.service.create({
      data: data,
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
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Aluno",
    action: "read",
    possession: "any",
  })
  @common.Get()
  @swagger.ApiOkResponse({ type: [Aluno] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(AlunoFindManyArgs)
  async findMany(@common.Req() request: Request): Promise<Aluno[]> {
    const args = plainToClass(AlunoFindManyArgs, request.query);
    return this.service.findMany({
      ...args,
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
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Aluno",
    action: "read",
    possession: "own",
  })
  @common.Get("/:id")
  @swagger.ApiOkResponse({ type: Aluno })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async findOne(
    @common.Param() params: AlunoWhereUniqueInput
  ): Promise<Aluno | null> {
    const result = await this.service.findOne({
      where: params,
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
    if (result === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: "Aluno",
    action: "update",
    possession: "any",
  })
  @common.Patch("/:id")
  @swagger.ApiOkResponse({ type: Aluno })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async update(
    @common.Param() params: AlunoWhereUniqueInput,
    @common.Body() data: AlunoUpdateInput
  ): Promise<Aluno | null> {
    try {
      return await this.service.update({
        where: params,
        data: data,
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
    resource: "Aluno",
    action: "delete",
    possession: "any",
  })
  @common.Delete("/:id")
  @swagger.ApiOkResponse({ type: Aluno })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async delete(
    @common.Param() params: AlunoWhereUniqueInput
  ): Promise<Aluno | null> {
    try {
      return await this.service.delete({
        where: params,
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
    resource: "Ocorrencia",
    action: "read",
    possession: "any",
  })
  @common.Get("/:id/ocorrencia")
  @ApiNestedQuery(OcorrenciaFindManyArgs)
  async findManyOcorrencia(
    @common.Req() request: Request,
    @common.Param() params: AlunoWhereUniqueInput
  ): Promise<Ocorrencia[]> {
    const query = plainToClass(OcorrenciaFindManyArgs, request.query);
    const results = await this.service.findOcorrencia(params.id, {
      ...query,
      select: {
        createdAt: true,
        descricao: true,
        id: true,
        tipo: true,
        updatedAt: true,
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
    resource: "Aluno",
    action: "update",
    possession: "any",
  })
  @common.Post("/:id/ocorrencia")
  async connectOcorrencia(
    @common.Param() params: AlunoWhereUniqueInput,
    @common.Body() body: OcorrenciaWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      ocorrencia: {
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
    resource: "Aluno",
    action: "update",
    possession: "any",
  })
  @common.Patch("/:id/ocorrencia")
  async updateOcorrencia(
    @common.Param() params: AlunoWhereUniqueInput,
    @common.Body() body: OcorrenciaWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      ocorrencia: {
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
    resource: "Aluno",
    action: "update",
    possession: "any",
  })
  @common.Delete("/:id/ocorrencia")
  async disconnectOcorrencia(
    @common.Param() params: AlunoWhereUniqueInput,
    @common.Body() body: OcorrenciaWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      ocorrencia: {
        disconnect: body,
      },
    };
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: "ParticipacaoAtividade",
    action: "read",
    possession: "any",
  })
  @common.Get("/:id/participacaoAtividades")
  @ApiNestedQuery(ParticipacaoAtividadeFindManyArgs)
  async findManyParticipacaoAtividades(
    @common.Req() request: Request,
    @common.Param() params: AlunoWhereUniqueInput
  ): Promise<ParticipacaoAtividade[]> {
    const query = plainToClass(
      ParticipacaoAtividadeFindManyArgs,
      request.query
    );
    const results = await this.service.findParticipacaoAtividades(params.id, {
      ...query,
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
    if (results === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return results;
  }

  @nestAccessControl.UseRoles({
    resource: "Aluno",
    action: "update",
    possession: "any",
  })
  @common.Post("/:id/participacaoAtividades")
  async connectParticipacaoAtividades(
    @common.Param() params: AlunoWhereUniqueInput,
    @common.Body() body: ParticipacaoAtividadeWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      participacaoAtividades: {
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
    resource: "Aluno",
    action: "update",
    possession: "any",
  })
  @common.Patch("/:id/participacaoAtividades")
  async updateParticipacaoAtividades(
    @common.Param() params: AlunoWhereUniqueInput,
    @common.Body() body: ParticipacaoAtividadeWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      participacaoAtividades: {
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
    resource: "Aluno",
    action: "update",
    possession: "any",
  })
  @common.Delete("/:id/participacaoAtividades")
  async disconnectParticipacaoAtividades(
    @common.Param() params: AlunoWhereUniqueInput,
    @common.Body() body: ParticipacaoAtividadeWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      participacaoAtividades: {
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
