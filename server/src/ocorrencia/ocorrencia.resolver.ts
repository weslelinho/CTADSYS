import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { OcorrenciaResolverBase } from "./base/ocorrencia.resolver.base";
import { Ocorrencia } from "./base/Ocorrencia";
import { OcorrenciaService } from "./ocorrencia.service";

@graphql.Resolver(() => Ocorrencia)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class OcorrenciaResolver extends OcorrenciaResolverBase {
  constructor(
    protected readonly service: OcorrenciaService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
