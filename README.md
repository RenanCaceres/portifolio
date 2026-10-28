<div align="center">

<a href="https://github.com/RenanCaceres">
  <img
    src="https://capsule-render.vercel.app/api?type=waving&height=220&section=header&text=Renan%20C%C3%A1ceres%20%E2%80%94%20Portfolio&fontSize=44&fontColor=ffffff&fontAlignY=38&desc=Software%20Engineering%20%7C%20Full%20Stack%20%7C%20Backend%20%7C%20Mobile%20%7C%20Gen%20AI&descAlignY=58&descSize=16&animation=fadeIn&color=0:06050e,50:21134f,100:7c3aed"
    width="100%"
    alt="Renan Cáceres Portfolio Header"
  />
</a>

<img
  src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=19&duration=3000&pause=1000&color=A78BFA&center=true&vCenter=true&width=820&lines=Portf%C3%B3lio+Interativo+de+Engenharia+de+Software;Terminal+CLI+Integrado+%E2%80%A2+Command+Palette+(Ctrl%2BK)+%E2%80%A2+Bil%C3%ADngue+(PT%2FEN);Case+Studies+de+Arquitetura%3A+CyberGuard+Bot+%26+BeautyFlow+SaaS;Hospedado+na+Vercel+Edge+Network+com+Zero-Build+Latency"
  alt="Typing SVG"
/>

<br>

<img src="https://img.shields.io/badge/UTFPR-Campus%20Corn%C3%A9lio%20Proc%C3%B3pio-5B21B6?style=for-the-badge" />
<img src="https://img.shields.io/badge/Vercel-Edge%20Ready-000000?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
<img src="https://img.shields.io/badge/HTML5_%26_CSS3-Glassmorphism-7C3AED?style=for-the-badge&logo=css3&logoColor=white" />
<img src="https://img.shields.io/badge/GitHub_API-Live_Sync-10B981?style=for-the-badge&logo=github&logoColor=white" />

<br><br>

<a href="https://github.com/RenanCaceres">
  <img src="https://img.shields.io/badge/GitHub-RenanCaceres-181717?style=for-the-badge&logo=github" />
</a>
<a href="https://www.linkedin.com/in/renan-caceres/">
  <img src="https://img.shields.io/badge/LinkedIn-Renan%20C%C3%A1ceres-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>
<a href="mailto:renancanselmo@gmail.com">
  <img src="https://img.shields.io/badge/Email-renancanselmo%40gmail.com-6D28D9?style=for-the-badge&logo=gmail&logoColor=white" />
</a>

</div>

---

# ⚡ Sobre o Projeto

Este repositório contém o código-fonte do **Portfólio Profissional de Engenharia de Software** de **Renan Cáceres Anselmo**, projetado com estética **Cyber-Violet / Vercel Obsidian**, arquitetura de ultra-baixa latência e integração em tempo real com a API do GitHub.

Mais do que uma página estática de links, o portfólio funciona como uma **plataforma interativa de inspeção técnica**, apresentando os fluxos arquiteturais, decisões de banco de dados, criptografia e integrações de IA dos principais sistemas desenvolvidos pelo autor.

---

# ✨ Funcionalidades & Diferenciais Técnicos

| Funcionalidade | Descrição Técnica |
| :--- | :--- |
| 🎨 **Design System Multi-Tema (`◐`)** | Alternância instantânea entre **Cyber-Violet** (padrão), **Vercel Obsidian** (monocromático) e **Clean Light**, com persistência em `localStorage` e **Spotlight Radial** guiado pelo cursor. |
| 🌌 **Neural Constellation Canvas** | Background interativo renderizado em `HTML5 Canvas` a 60 FPS com física de partículas e conexões dinâmicas ao movimento do mouse. |
| 🌎 **Internacionalização em Tempo Real (`PT` / `EN`)** | Motor `i18n` próprio que traduz instantaneamente toda a interface, descrições técnicas, pipelines de arquitetura e trajetória acadêmica sem recarregar a página. |
| ⌘ **Command Palette (`Ctrl + K` / `⌘K`)** | Paleta de ações rápidas inspirada na Vercel e Linear para abrir case studies, copiar e-mail, alternar idioma/tema ou exportar currículo. |
| 💻 **Terminal CLI Interativo (`renan@utfpr:~`)** | Shell interativo com suporte a comandos (`help`, `whoami`, `arch cyberguard`, `arch beautyflow`, `cat focus.yaml`, `projects`, `skills`, `sudo hire renan` e `clear`). |
| 🏗️ **Modais de Arquitetura de Sistemas** | Visualização detalhada do pipeline de engenharia de cada projeto (*CyberGuard Bot*, *BeautyFlow API*, *BeautyFlow Mobile*, *Casas de Hogwarts*, *Sistema de Biblioteca*, *Try, Catch & Learn*, *Java POO* e *Game Rental SQL*). |
| 🐍 **GitHub Live Telemetry & Snake** | Sincronização automática via `api.github.com/users/RenanCaceres` + incorporação do *Contribution Snake* oficial. |
| 📄 **Currículo Executivo Imprimível (`@media print`)** | Folha de estilo dedicada que converte o portfólio em um currículo limpo pronto para exportação em PDF com 1 clique. |

---

# 🏗️ Arquitetura da Aplicação

```mermaid
flowchart LR
    subgraph UI["🌐 Camada de Apresentação (index.html + styles.css)"]
        Hero["Hero + Code Showcase + Neural Canvas"]
        Bento["Bento Grid + Live Contribution Snake"]
        Explorer["Case Studies Explorer + Filtros & Busca"]
        CLI["Terminal Interativo (renan@utfpr:~)"]
        Modals["Modais de Arquitetura & Command Palette (Ctrl+K)"]
    end

    subgraph Engine["⚙️ Motor Interativo (app.js + data.js)"]
        I18N["i18n Engine (PT-BR / EN-US)"]
        Theme["Theme Manager (Cyber / Obsidian / Light)"]
        Sync["GitHub REST API Client"]
    end

    subgraph External["☁️ Integrações & Edge"]
        GH["GitHub API (api.github.com/users/RenanCaceres)"]
        Vercel["Vercel Edge Network (vercel.json + Cache)"]
    end

    UI <--> Engine
    Sync -->|Fetch Live Metrics| GH
    Vercel -->|CDN Global + Clean URLs| UI
```

---

# 🗂️ Estrutura de Pastas

```text
renan-caceres-portfolio/
├── index.html          # Estrutura semântica principal, SEO e OpenGraph
├── vercel.json         # Configuração de rotas limpas, cache imutável e headers de segurança
├── package.json        # Metadados do projeto e scripts locais
├── README.md           # Documentação oficial do repositório
├── assets/
│   └── favicon.svg     # Monograma vetorial RC com gradiente Cyber-Violet
├── css/
│   └── styles.css      # Design system, temas, Bento Grid, animações e layout @media print
└── js/
    ├── data.js         # Base de dados bilíngue (PT/EN) dos projetos, arquiteturas e skills
    └── app.js          # Motor interativo (Canvas, Terminal CLI, Command Palette Ctrl+K e GitHub Sync)
```

---

# 🚀 Como Executar e Hospedar na Vercel

### 1. Executar Localmente
Como o projeto foi engenheirado com zero dependências de compilação pesadas para máxima velocidade na Edge, basta abrir o arquivo `index.html` diretamente no navegador ou servir a pasta com:
```bash
npx serve .
```

### 2. Deploy na Vercel
1. Suba esta pasta para um repositório no seu GitHub.
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório.
3. Clique em **Deploy** — o arquivo `vercel.json` configura automaticamente `cleanUrls`, cache de longa duração para `css/js/assets` e headers de segurança (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

---

# 👨‍💻 Autor

<div align="center">

Desenvolvido por **Renan Cáceres Anselmo**  
*Estudante de Análise e Desenvolvimento de Sistemas (UTFPR-CP) | Desenvolvedor Full Stack & Backend*

<a href="https://github.com/RenanCaceres">
  <img src="https://img.shields.io/badge/GitHub-RenanCaceres-181717?style=for-the-badge&logo=github" />
</a>
<a href="https://www.linkedin.com/in/renan-caceres/">
  <img src="https://img.shields.io/badge/LinkedIn-Renan%20C%C3%A1ceres-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
</a>
<a href="mailto:renancanselmo@gmail.com">
  <img src="https://img.shields.io/badge/Email-renancanselmo%40gmail.com-6D28D9?style=for-the-badge&logo=gmail&logoColor=white" />
</a>

<br><br>

💜 *Building software. Learning continuously. Solving problems.*

<br>

<img
  src="https://capsule-render.vercel.app/api?type=waving&height=120&section=footer&color=0:7c3aed,50:21134f,100:06050e"
  width="100%"
  alt="Footer"
/>

</div>
