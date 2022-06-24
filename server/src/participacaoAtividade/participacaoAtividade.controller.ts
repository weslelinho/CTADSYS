import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { ParticipacaoAtividadeService } from "./participacaoAtividade.service";
import { ParticipacaoAtividadeControllerBase } from "./base/participacaoAtividade.controller.base";

@swagger.ApiTags("participacaoAtividades")
@common.Controller("participacaoAtividades")
export class ParticipacaoAtividadeController extends ParticipacaoAtividadeControllerBase {
  constructor(
    protected readonly service: ParticipacaoAtividadeService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
