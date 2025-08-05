# Avaliação de SSR e Build Estático

Este projeto atualmente utiliza **Vite + React** com renderização no lado do cliente e um script de _prerender_ para inserir o HTML do aplicativo gerado no build. A seguir está uma análise das principais opções para adotar SSR ou geração de site estático.

## vite-plugin-ssr
- **Prós**
  - Integra-se diretamente ao ecossistema Vite já utilizado.
  - Permite páginas híbridas (SSR + SPA) com controle explícito sobre o _routing_.
  - Suporta _pre-render_ para gerar HTML estático em tempo de build.
- **Contras**
  - Menos opinioso; exige configuração manual de roteamento e dados.
  - Comunidade menor em comparação a frameworks mais consolidados.

## Astro
- **Prós**
  - Focado em geração estática por padrão, com _islands architecture_ para interatividade.
  - Ótimo para páginas de marketing e conteúdo com poucas seções dinâmicas.
  - Integra facilmente componentes React, permitindo reutilizar o Hero existente.
- **Contras**
  - Curva de aprendizado para a sintaxe `.astro` e para a arquitetura em ilhas.
  - Menos adequado se o projeto exigir muitas funcionalidades específicas de SPA.

## Next.js
- **Prós**
  - Ecossistema maduro e grande comunidade.
  - Suporte nativo a SSR, SSG e roteamento baseado em arquivos.
  - Ferramentas integradas de _data fetching_ e otimizações de imagem.
- **Contras**
  - Migração mais complexa devido a diferenças de estrutura e roteamento.
  - Pode introduzir sobrecarga desnecessária se a maioria das páginas for estática.

## Recomendações
Para este projeto, que é majoritariamente uma _landing page_ com foco em performance e SEO:
- **Astro** ou **vite-plugin-ssr** podem ser opções leves para gerar HTML estático mantendo o controle sobre desempenho.
- **Next.js** é indicado apenas se houver necessidade futura de funcionalidades avançadas de aplicação web (APIs internas, autenticação complexa etc.).

Independentemente da escolha, a exportação estática da seção **Hero** — conforme implementado neste commit — melhora o _Largest Contentful Paint_ e prepara o código para uma migração gradual para SSR ou SSG.
