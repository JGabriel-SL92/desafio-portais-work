# Desafio Técnico - Portal da Transparência

Aplicação desenvolvida em React com TypeScript para listar, filtrar e organizar os serviços do Portal da Transparência consumindo uma API REST.

## 📌 O que o projeto faz?

A aplicação busca as categorias e botões da API pública e entrega uma interface limpa em layout Desktop com:

- **Busca por texto:** Filtra os botões pelo nome em tempo real.
- **Filtro por categoria:** Permite isolar apenas uma categoria específica no select.
- **Ordenação:** Organiza os botões em ordem alfabética (A-Z / Z-A) ou pela posição padrão da API.
- **Tratamento de links:** Corrige rotas relativas (adicionando o domínio base) e limpa tokens das URLs para facilitar a navegação.

## 🛠️ Tecnologias

- **React** (useState, useEffect, useMemo)
- **TypeScript** (interfaces para tipagem da API)
- **Vite**
- **CSS3** (Grid e Flexbox)

## 📁 Estrutura de arquivos

- `src/types.ts`: Tipagem dos dados retornados pela API (`ButtonItem`, `CategoryItem`, `ApiResponse`).
- `src/App.tsx`: Lógica principal da aplicação (consumo de API, filtros, ordenação e renderização).
- `src/App.css`: Estilização visual dos cards e controles.

## 🚀 Como rodar na sua máquina

1. Instale as dependências:
   ```bash
   npm install