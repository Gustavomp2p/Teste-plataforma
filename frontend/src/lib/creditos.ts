/** Equipe do projeto exibida em /creditos.
 *  Única fonte da página — para incluir ou ajustar alguém, edite este array. */

export type Integrante = {
  nome: string;
  funcao: string;
  email: string;
  github: string;
};

export const EQUIPE: Integrante[] = [
  {
    nome: "Igor de Aguiar",
    funcao: "Tech lead · Front-end",
    email: "igordeaguiar57@gmail.com",
    github: "IG1816",
  },
  {
    nome: "Gustavo Marcelino Teixeira",
    funcao: "Back-end",
    email: "gustavomp2p@gmail.com",
    github: "Gustavomp2p",
  },
  {
    nome: "Joice Vieira",
    funcao: "DevOps",
    email: "joicevieirab@hotmail.com",
    github: "JOYVIEIR4",
  },
];

export const REPOSITORIO =
  "https://github.com/conectaecapacita/plataforma-projetos-bfd";
