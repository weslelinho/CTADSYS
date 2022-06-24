import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { ParticipacaoAtividadeResolverBase } from "./base/participacaoAtividade.resolver.base";
import { ParticipacaoAtividade } from "./base/ParticipacaoAtividade";
import { ParticipacaoAtividadeService } from "./participacaoAtividade.service";

@graphql.Resolver(() => ParticipacaoAtividade)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class ParticipacaoAtividadeResolver extends ParticipacaoAtividadeResolverBase {
  constructor(
    protected readonly service: ParticipacaoAtividadeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
