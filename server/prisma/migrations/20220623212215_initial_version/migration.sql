-- CreateEnum
CREATE TYPE "EnumAlunoSexo" AS ENUM ('Masculino', 'Feminino');

-- CreateEnum
CREATE TYPE "EnumOcorrenciaTipo" AS ENUM ('Saida', 'ComportamentoInadequado', 'Dispensado', 'Desobediencia');

-- CreateTable
CREATE TABLE "User" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT,
    "id" TEXT NOT NULL,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "roles" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "cidade" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataEmissaoRg" TIMESTAMP(3),
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "dataSaida" TIMESTAMP(3),
    "endereco" TEXT,
    "filiacaoMae" TEXT NOT NULL,
    "filiacaoPai" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "idadeInicioDroga" TEXT NOT NULL,
    "matricula" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "outraClinica" TEXT,
    "possuiDoenca" TEXT,
    "processo" TEXT,
    "profissao" TEXT NOT NULL,
    "regulamento" BOOLEAN,
    "religiao" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "rgOrgaoExpedidor" TEXT NOT NULL,
    "secao" TEXT NOT NULL,
    "sexo" "EnumAlunoSexo" NOT NULL,
    "tempoInternacao" BOOLEAN NOT NULL,
    "tiposDrogas" TEXT,
    "tituloEleitor" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "zona" TEXT NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ocorrencia" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "tipo" "EnumOcorrenciaTipo",
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ocorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoAtividade" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "tempoDuracao" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoAtividade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipacaoAtividade" (
    "alunoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TIMESTAMP(3),
    "id" TEXT NOT NULL,
    "tipoAtividadeId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParticipacaoAtividade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlunoToOcorrencia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_matricula_key" ON "Aluno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "_AlunoToOcorrencia_AB_unique" ON "_AlunoToOcorrencia"("A", "B");

-- CreateIndex
CREATE INDEX "_AlunoToOcorrencia_B_index" ON "_AlunoToOcorrencia"("B");

-- AddForeignKey
ALTER TABLE "ParticipacaoAtividade" ADD CONSTRAINT "ParticipacaoAtividade_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipacaoAtividade" ADD CONSTRAINT "ParticipacaoAtividade_tipoAtividadeId_fkey" FOREIGN KEY ("tipoAtividadeId") REFERENCES "TipoAtividade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlunoToOcorrencia" ADD FOREIGN KEY ("A") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlunoToOcorrencia" ADD FOREIGN KEY ("B") REFERENCES "Ocorrencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
