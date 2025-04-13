# Nuvigo Web

Nuvigo é um assistente de clima/tempo inteligente que fornece previsões meteorológicas precisas e personalizadas. Esta interface web, desenvolvida com Next.js, permite aos usuários interagir de forma intuitiva com o sistema, visualizando dados meteorológicos em tempo real e previsões futuras.

## 🚀 Começando

Primeiro, instale as dependências do projeto:

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

Em seguida, inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

Você pode começar a editar a página modificando `app/page.tsx`. A página será atualizada automaticamente conforme você edita o arquivo.

## 🛠️ Tecnologias Utilizadas

- [Next.js](https://nextjs.org) - Framework React para produção
- [TypeScript](https://www.typescriptlang.org) - Superset JavaScript com tipagem estática
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS utilitário
- [SWR](https://swr.vercel.app) - Biblioteca de gerenciamento de estado e cache
- [Jest](https://jestjs.io) - Framework de testes

## 🎯 Objetivos do Projeto

O Nuvigo Web tem como objetivo principal fornecer uma interface moderna e intuitiva para os usuários do assistente de clima/tempo Nuvigo, garantindo:

- Acesso rápido e preciso a informações meteorológicas
- Experiência de usuário fluida e agradável
- Integração eficiente com a API backend
- Performance excepcional em todos os dispositivos
- Segurança e privacidade dos dados
- Escalabilidade para crescimento futuro
- Manutenibilidade do código

## 📚 Recursos

- [Documentação do Next.js](https://nextjs.org/docs) - Aprenda sobre os recursos e API do Next.js
- [Aprenda Next.js](https://nextjs.org/learn) - Tutorial interativo do Next.js
- [Repositório GitHub do Next.js](https://github.com/vercel/next.js) - Contribuições são bem-vindas!

## 🚀 Deploy

A maneira mais fácil de fazer deploy da sua aplicação Next.js é usando a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira nossa [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

## 📝 Estrutura do Projeto

```
nuvigo-web/
├── app/                # Diretório principal da aplicação
│   ├── page.tsx        # Página inicial
│   └── layout.tsx      # Layout principal
├── public/             # Arquivos estáticos
├── styles/             # Estilos globais
└── package.json        # Dependências e scripts
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia o [guia de contribuição](CONTRIBUTING.md) para mais detalhes.

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🐳 Executando com Docker

O projeto pode ser executado facilmente usando Docker. Siga os passos abaixo:

1. **Construa a imagem Docker**:
```bash
docker build -t nuvigo-web .
```

2. **Execute o container**:
```bash
docker run -p 3000:3000 nuvigo-web
```

3. **Para desenvolvimento com hot-reload**:
```bash
docker run -p 3000:3000 -v $(pwd):/app nuvigo-web npm run dev
```

4. **Para produção**:
```bash
docker run -p 3000:3000 -e NODE_ENV=production nuvigo-web npm start
```

### Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente no seu arquivo `.env`:

```env
NEXT_PUBLIC_API_URL=http://seu-backend-url
# Outras variáveis de ambiente necessárias
```