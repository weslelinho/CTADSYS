import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { TipoAtividadeResolverBase } from "./base/tipoAtividade.resolver.base";
import { TipoAtividade } from "./base/TipoAtividade";
import { TipoAtividadeService } from "./tipoAtividade.service";

@graphql.Resolver(() => TipoAtividade)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class TipoAtividadeResolver extends TipoAtividadeResolverBase {
  constructor(
    protected readonly service: TipoAtividadeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
