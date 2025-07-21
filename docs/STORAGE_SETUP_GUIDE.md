# 📁 GUIA DE CONFIGURAÇÃO DO SUPABASE STORAGE

> **Problema:** Upload de imagens do blog não funciona  
> **Causa:** Bucket `blog-images` não configurado  
> **Solução:** Criar bucket conforme este guia  

## 🔍 **Diagnóstico Rápido**

Execute este comando no console do navegador em `/admin`:
```javascript
// Verificar se bucket existe
supabase.storage.listBuckets().then(({data}) => 
  console.log('Buckets:', data?.map(b => b.name))
);
```

**Resultado esperado:** `['blog-images']`  
**Se não aparecer:** Siga as soluções abaixo

---

## 🛠️ **Solução 1: Via Dashboard Supabase (Recomendado)**

### **Passo a Passo:**

1. **Acesse o Supabase:**
   - URL: https://app.supabase.com
   - Login na sua conta
   - Selecione o projeto "Libra Crédito"

2. **Navegue para Storage:**
   - Menu lateral → **Storage**
   - Clique em **"Create Bucket"**

3. **Configure o Bucket:**
   ```
   Nome: blog-images
   ✅ Public bucket: HABILITADO
   ✅ File size limit: 5 MB
   ✅ Allowed MIME types:
      - image/jpeg
      - image/png  
      - image/gif
      - image/webp
   ```

4. **Criar Bucket:**
   - Clique em **"Create bucket"**
   - Aguarde confirmação de sucesso

---

## 🔧 **Solução 2: Via Dashboard Admin (Automático)**

1. **Acesse:** `http://localhost:5173/admin`
2. **Procure:** Seção "🔧 Diagnósticos Supabase" 
3. **Clique:** "📁 Criar Bucket Storage"
4. **Aguarde:** Confirmação de sucesso
5. **Execute:** "🔍 Executar Diagnósticos" para validar

---

## 📋 **Solução 3: Via API (Avançado)**

Execute no console do navegador:

```javascript
// Criar bucket programaticamente
const { data, error } = await supabase.storage.createBucket('blog-images', {
  public: true,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  fileSizeLimit: 5242880 // 5MB
});

if (error) {
  console.error('Erro:', error.message);
} else {
  console.log('✅ Bucket criado com sucesso!', data);
}
```

---

## ✅ **Validação do Setup**

### **Teste 1: Via Dashboard Admin**
1. Acesse `/admin`
2. Execute "🔍 Executar Diagnósticos"
3. Procure resultado "Storage Bucket"
4. **Status esperado:** ✅ Bucket blog-images encontrado

### **Teste 2: Upload de Imagem**
1. Vá para qualquer post do blog no admin
2. Tente fazer upload de uma imagem
3. **Comportamento esperado:** 
   - ✅ Upload bem-sucedido
   - ✅ URL da imagem contém "supabase.co"
   - ❌ **Não** deve ser base64 (data:image/...)

### **Teste 3: Console Browser**
```javascript
// Listar arquivos no bucket
const { data, error } = await supabase.storage
  .from('blog-images')
  .list('', { limit: 10 });

console.log('Arquivos no bucket:', data);
```

---

## 🚨 **Troubleshooting**

### **Erro: "Bucket already exists"**
✅ **Solução:** Bucket já foi criado! Execute os testes de validação.

### **Erro: "Storage API not enabled"**
❌ **Problema:** Storage não habilitado no projeto Supabase  
✅ **Solução:** 
1. Supabase Dashboard → Settings → API
2. Habilitar Storage API

### **Erro: "Access denied"**
❌ **Problema:** Falta de permissões  
✅ **Solução:**
1. Verificar se você é owner/admin do projeto
2. Verificar se a API Key está correta

### **Upload funciona mas imagem não aparece**
❌ **Problema:** Bucket não é público  
✅ **Solução:**
1. Storage → blog-images → Settings
2. Habilitar "Public bucket"

---

## 📊 **Status Atual do Sistema**

**✅ Funcionando:** Fallback local (base64)  
**❌ Problema:** Upload para Supabase Storage  
**🎯 Objetivo:** Upload direto para Supabase Storage  

### **Benefícios do Storage correto:**
- ✅ Imagens acessíveis de qualquer dispositivo
- ✅ Melhor performance (não sobrecarrega localStorage)
- ✅ CDN global do Supabase
- ✅ Backup automático
- ✅ Integração completa com o CMS

---

## 🎯 **Após Configuração**

1. **Teste upload** de uma imagem no blog
2. **Verifique URL** da imagem (deve conter "supabase.co")
3. **Execute diagnósticos** para confirmar tudo funcionando
4. **Parabéns!** Sistema de blog totalmente funcional! 🎉

---

## 🔒 **Correções de Segurança Adicionais**

Se você vir **avisos de segurança** no Supabase Dashboard:

### **Executar Correções Automáticas:**
1. Acesse: https://app.supabase.com → SQL Editor
2. Execute o arquivo: `supabase-security-fixes.sql`
3. Aguarde confirmação de sucesso

### **Problemas Resolvidos:**
- ✅ RLS habilitado em todas as tabelas
- ✅ Funções com `search_path` fixo
- ✅ Views sem `SECURITY DEFINER` desnecessário
- ✅ Políticas de segurança otimizadas

---

**🔗 Links Úteis:**
- Dashboard Admin: `/admin`
- Diagnósticos: `/admin` → Seção "Diagnósticos Supabase"
- Supabase Dashboard: https://app.supabase.com
- Correções de Segurança: `supabase-security-fixes.sql`