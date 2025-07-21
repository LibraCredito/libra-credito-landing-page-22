# ⚡ QUICK START GUIDE - Libra Crédito

> **Sistema funcionando em 5 minutos**

## 🚀 1. Setup Inicial (2 min)

```bash
# Clone e instale
git clone <YOUR_GIT_URL>
cd libra-credito-landing-page-22
npm install
```

## 📊 2. Configurar Supabase (3 min)

### **a) Setup Banco (1 min):**
1. Acesse: https://app.supabase.com
2. Crie/acesse seu projeto
3. Vá em **SQL Editor**
4. Execute o arquivo: `supabase-setup-complete.sql`

### **b) 🔥 Storage Bucket (2 min):**
1. Vá em **Storage** → **"Create Bucket"**
2. Configure:
   - **Nome:** `blog-images`
   - **Public bucket:** ✅ **HABILITADO**
   - **File size limit:** 5 MB
   - **MIME types:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`

> ⚠️ **Crítico para upload de imagens do blog!**

## 🧪 3. Testar Sistema (1 min)

```bash
npm run dev
```

**URLs de Teste:**
- 🏠 **Homepage:** http://localhost:5173
- 🧪 **Diagnóstico:** http://localhost:5173/test-supabase
- 🧮 **Simulação:** http://localhost:5173/simulacao
- 🎛️ **Admin:** http://localhost:5173/admin

## ✅ 4. Checklist de Funcionamento

- [ ] ✅ Dependências instaladas
- [ ] 📊 Tabelas criadas no Supabase
- [ ] 🧪 Teste `/test-supabase` passa
- [ ] 🧮 Simulação salva dados
- [ ] 🎛️ Admin mostra simulações
- [ ] 📝 Blog funciona

## 🆘 5. Problemas Comuns

**❌ "Module not found"**
```bash
rm -rf node_modules package-lock.json && npm install
```

**❌ "Supabase connection failed"**
- Verificar URL/API Key em `src/lib/supabase.ts`
- Verificar se tabelas foram criadas

**❌ "Build failing"**
```bash
npm run typecheck && npm run lint
```

## 🎯 6. Comandos Úteis

```bash
# Desenvolvimento
npm run dev         # Servidor desenvolvimento
npm run build       # Build produção
npm run preview     # Preview do build

# Qualidade
npm run lint        # ESLint
npm run typecheck   # TypeScript check
```

## 📋 7. Estrutura Principal

```
src/
├── pages/
│   ├── Index.tsx        # Homepage
│   ├── Simulacao.tsx    # Simulador
│   ├── AdminDashboard.tsx # Admin
│   └── Blog.tsx         # Blog
├── services/
│   ├── simulationService.ts  # API simulação
│   ├── blogService.ts        # Blog CMS
│   └── partnersService.ts    # Parceiros
└── lib/
    └── supabase.ts      # Config Supabase
```

## 🎊 8. Funcionalidades Prontas

✅ **Simulação inteligente** com fallback local  
✅ **Tracking 360°** de usuários  
✅ **Dashboard admin** completo  
✅ **Blog CMS** integrado  
✅ **Sistema de parceiros**  
✅ **LGPD compliant**  
✅ **Mobile responsive**  
✅ **SEO otimizado**  

**🚀 Sistema pronto para uso!**