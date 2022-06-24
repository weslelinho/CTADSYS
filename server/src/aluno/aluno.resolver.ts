import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { AlunoResolverBase } from "./base/aluno.resolver.base";
import { Aluno } from "./base/Aluno";
import { AlunoService } from "./aluno.service";

@graphql.Resolver(() => Aluno)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class AlunoResolver extends AlunoResolverBase {
  constructor(
    protected readonly service: AlunoService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
