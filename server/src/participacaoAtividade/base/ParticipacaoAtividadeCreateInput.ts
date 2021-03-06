/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/docs/how-to/custom-code

------------------------------------------------------------------------------
  */
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { AlunoWhereUniqueInput } from "../../aluno/base/AlunoWhereUniqueInput";
import { ValidateNested, IsDate, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { TipoAtividadeWhereUniqueInput } from "../../tipoAtividade/base/TipoAtividadeWhereUniqueInput";
@InputType()
class ParticipacaoAtividadeCreateInput {
  @ApiProperty({
    required: true,
    type: () => AlunoWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => AlunoWhereUniqueInput)
  @Field(() => AlunoWhereUniqueInput)
  aluno!: AlunoWhereUniqueInput;

  @ApiProperty({
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Field(() => Date, {
    nullable: true,
  })
  data?: Date | null;

  @ApiProperty({
    required: true,
    type: () => TipoAtividadeWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => TipoAtividadeWhereUniqueInput)
  @Field(() => TipoAtividadeWhereUniqueInput)
  tipoAtividade!: TipoAtividadeWhereUniqueInput;
}
export { ParticipacaoAtividadeCreateInput };
