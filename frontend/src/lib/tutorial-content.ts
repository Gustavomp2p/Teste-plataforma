/** Conteúdo do "Guia Rápido — Plataforma BFD" (documento oficial).
 *  O PDF completo fica em /public/tutorial e é servido em TUTORIAL_PDF.
 *  Para publicar uma versão nova, sobrescreva o arquivo e ajuste as seções
 *  abaixo se a estrutura do documento mudar. */

export const TUTORIAL_PDF = "/tutorial/guia-rapido-plataforma-bfd.pdf";

export const TUTORIAL = {
  titulo: "Guia Rápido — Plataforma BFD",
  descricao:
    "Guia oficial de utilização da Plataforma BFD (Bolsa Futuro Digital). Em três páginas, cobre a criação de conta, o cadastro e acompanhamento de desafios pelas empresas e a consulta de demandas pelos usuários.",
} as const;

export const TUTORIAL_SECOES = [
  {
    numero: "1",
    titulo: "Primeiros passos",
    resumo:
      "Como criar sua conta, escolher o tipo certo e entrar na plataforma.",
    topicos: [
      "Criar conta em 5 passos",
      "Escolher entre conta Empresa e Usuário",
      "Fazer login e recuperar a senha",
      "Para qual painel cada conta é direcionada",
    ],
  },
  {
    numero: "2",
    titulo: "Para empresas",
    resumo:
      "Como cadastrar um desafio e acompanhar o andamento da demanda.",
    topicos: [
      "Dados da empresa e do desafio",
      "Enviar a demanda para qualificação",
      "Acompanhar em “Suas demandas”",
      "O que significa cada status",
    ],
  },
  {
    numero: "3",
    titulo: "Para usuários",
    resumo:
      "Como consultar as demandas disponíveis, conhecer as soluções e resolver dúvidas.",
    topicos: [
      "Consultar o catálogo de demandas",
      "Quando uma demanda aparece",
      "As 5 áreas de solução do programa",
      "Dúvidas frequentes de acesso",
    ],
  },
] as const;
