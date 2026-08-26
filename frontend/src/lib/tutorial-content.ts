/** Conteúdo do "Tutorial de Utilização — Plataforma BFD" (documento oficial).
 *  O PDF completo fica em /public/tutorial e é servido em TUTORIAL_PDF. */

export const TUTORIAL_PDF = "/tutorial/tutorial-utilizacao-plataforma.pdf";

export const TUTORIAL = {
  titulo: "Tutorial de Utilização — Plataforma BFD",
  descricao:
    "Documento oficial de uso da Plataforma BFD (Bolsa Futuro Digital). Descreve o que já está implementado e disponível na versão atual da plataforma, servindo como guia para o usuário final.",
} as const;

export const TUTORIAL_SECOES = [
  {
    numero: "1",
    titulo: "Apresentação",
    resumo:
      "O que é a Plataforma BFD, para quem foi criada (Empresa, Usuário e Administrador) e qual problema ela resolve.",
  },
  {
    numero: "2",
    titulo: "Acesso à Plataforma",
    resumo:
      "Como acessar pelo navegador, o que a página inicial apresenta e como usar o menu principal.",
  },
  {
    numero: "3",
    titulo: "Criação de Conta",
    resumo:
      "Campos solicitados, escolha entre conta Usuário e Empresa, regras de senha e o que acontece após o cadastro.",
  },
  {
    numero: "4",
    titulo: "Login",
    resumo:
      "Entrar por e-mail e senha ou com Google, recuperar a senha e para qual painel cada tipo de conta é direcionado.",
  },
  {
    numero: "5",
    titulo: "Cadastro de uma Demanda/Desafio",
    resumo:
      "Formulário completo: dados da empresa, responsável, contato, segmento, tipo de problema, descrição e urgência.",
  },
  {
    numero: "6",
    titulo: "Acompanhamento",
    resumo:
      "Como a empresa acompanha suas demandas, como o usuário consulta o catálogo e o significado de cada status.",
  },
  {
    numero: "7",
    titulo: "Soluções",
    resumo:
      "As 5 áreas de atuação do programa: Dashboard, Automação, Inteligência Artificial, Talentos e Impacto.",
  },
  {
    numero: "8",
    titulo: "Dashboard (Painel Administrativo)",
    resumo:
      "Visão consolidada de demandas, empresas e projetos — uso exclusivo da equipe do programa.",
  },
  {
    numero: "9",
    titulo: "Dúvidas e Orientações",
    resumo:
      "O que fazer quando não consegue acessar, quando uma demanda não aparece e o que cada mensagem de erro significa.",
  },
  {
    numero: "10",
    titulo: "Fluxo Resumido",
    resumo:
      "Do cadastro de conta ao acompanhamento, em um diagrama único de ponta a ponta.",
  },
  {
    numero: "11",
    titulo: "Observações",
    resumo:
      "Funcionalidades pendentes ou em validação identificadas na versão atual da plataforma.",
  },
] as const;
