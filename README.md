<h1>Projeto de Gestão de Projetos</h1>

Este projeto é uma aplicação para gestão de projetos, usuários e tarefas. Ele permite a criação e gerenciamento de usuários, projetos e tarefas, com diferentes permissões baseadas no tipo de usuário (comum, admin, líder de projeto).

<h2>Funcionalidades</h2>

<h3>Gerenciamento de Usuários</h3>

  Usuários comuns podem criar e editar a si mesmos.
  
  Admins podem criar novos admins, atualizar ou excluir seus próprios dados e em usuários não-admins.

<h3>Gerenciamento de Projetos</h3>

  Criar e gerenciar projetos.
  
  Apenas o líder do projeto pode editar e excluir o projeto.
  
  O usuário que cria um projeto é automaticamente o líder desse projeto.
  
  Associar usuários a projetos (apenas o líder pode adicionar membros a um projeto).
  
<h3>Gerenciamento de Tarefas</h3>

  Criar e gerenciar tarefas.
  Cada tarefa pode ser associada a um requerente e um responsável.
  
  Apenas o criador da tarefa pode editá-la ou excluí-la.
  
  Tarefas podem incluir descrição e story points.
  
<h3>Permissões e Acesso</h3>

  Usuários podem pertencer a apenas um projeto.
  
  Projetos podem ter vários membros/usuários.
  
  Apenas um usuário pode ser líder de um projeto.
  
  Um usuário pode não ter vínculo com nenhum projeto.
  
<h3>Tecnologias Utilizadas</h3>

  - Node.js
  - Express
  - Sequelize
  - PostgreSQL
  - Swagger
  - Nodemon

<h3>Instalação e Execução</h3>

1 - Clone o repositório:

  git clone <URL_DO_REPOSITORIO>
  
2 - Instale as dependências:

  npm install
  
3 - Crie um banco de dados PostgreSQL e adicione as informações no arquivo .env.postgres.

4 - Inicie o servidor:

    npm start
    
5 - Instale o banco de dados: 
Acesse a rota **localhost/install/** para instalar o banco de dados e popular as tabelas iniciais.

6 - Documentação da API: 
Acesse a documentação da API na rota **localhost/swagger/docs**

<h3>Estrutura do Projeto</h3>

Em breve
