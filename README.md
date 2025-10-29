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
│   ├── css/         # Arquivos de estilo
│   ├── js/           # Arquivos Javascript
│   └── index.html    # Página principal
├── dist/             # Arquivos compilados (gerado automaticamente)
└── package.json      # Dependências e scripts
```

## 🧩 Funcionalidades do site

Foram adicionadas novas interações e recursos para tornar o e-commerce mais completo e dinâmico:

### 🛒 Carrinho de Compras
- Adição e remoção de produtos.
- Atualização de quantidade de itens.
- Cálculo automático do valor total.
- Persistência dos dados no **localStorage**, mantendo o carrinho mesmo após recarregar a página.

### 🎨 Filtros Dinâmicos
- **Cor:** permite exibir apenas produtos de cores específicas.
- **Tamanho:** filtragem por tamanhos disponíveis (P, M, G, GG, etc.).
- **Faixa de preço:** seleção de intervalos de valores.
- Combinação de múltiplos filtros simultaneamente.

### ↕️ Ordenação de Produtos
- Ordenação por **mais recente**, **menor preço** ou **maior preço**.
- Atualização instantânea da listagem sem recarregar a página.

### 📄 Paginação
- Exibição limitada de produtos por página.
- Navegação dinâmica entre páginas com atualização fluida dos itens.

### 💾 Persistência
- Os produtos exibidos e o carrinho utilizam dados obtidos via **JSON Server**.
- O estado do carrinho é mantido no **localStorage**.

## 🔧 Scripts disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npx gulp build` - Gera build de produção

---

Desenvolvido como desafio técnico de front-end