# Save the Date · Wig Party da Ju

Convite interativo para o aniversário da Juliana em **quinta-feira, 3 de setembro de 2026**.

## Publicação no GitHub Pages

O projeto já inclui o workflow `.github/workflows/pages.yml`. Depois de enviar a branch `main` para um repositório público:

1. Abra **Settings → Pages** no repositório.
2. Em **Build and deployment**, selecione **GitHub Actions**.
3. Aguarde a ação “Publicar convite no GitHub Pages”.

O endereço ficará no formato `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Desenvolvimento

```bash
npm install
npm run dev
```

Para validar a versão estática do GitHub Pages:

```bash
npm run build:pages
```

O convite foi estruturado para receber, na segunda etapa, horário, endereço e confirmação de presença sem trocar de site.
