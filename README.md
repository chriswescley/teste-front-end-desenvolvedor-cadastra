# E-commerce Front-end

Projeto de e-commerce desenvolvido com HTML5, CSS3 e Javascript.

## 📋 Pré-requisitos

- Node.js versão 14 ou superior
- npm (gerenciador de pacotes do Node.js)

## 🚀 Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## ▶️ Como executar

Para iniciar o projeto em modo de desenvolvimento:

```bash
npm start
```

Este comando irá iniciar dois servidores simultaneamente:

- **Front-end**: http://localhost:3000
- **API (json-server)**: http://localhost:5000/products

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3 
- Javascript
- Gulp (otimização de imagens)
- JSON Server (API produtos)

## 📁 Estrutura do projeto

```
├── src/
│   ├── img/          # Imagens do projeto
│   ├── scss/         # Arquivos de estilo
│   ├── ts/           # Arquivos TypeScript
│   └── index.html    # Página principal
├── dist/             # Arquivos compilados (gerado automaticamente)
└── package.json      # Dependências e scripts
```

## 🔧 Scripts disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npx gulp build` - Gera build de produção

---

Desenvolvido como desafio técnico de front-end