# 📧 GUIA DE CONFIGURAÇÃO DE EMAIL AUTOMÁTICO - LIBRA CRÉDITO

> **Sistema implementado:** Envio automático de emails quando novo parceiro se cadastra

## 🎯 **O que foi implementado:**

✅ **Email para equipe:** Notificação automática com todos os dados do parceiro  
✅ **Email de confirmação:** Confirmação de recebimento para o parceiro  
✅ **Templates profissionais:** Formatação completa e profissional  
✅ **Envio em background:** Não bloqueia o processo de cadastro  
✅ **Logs detalhados:** Acompanhamento completo via console  

---

## 🛠️ **Configuração Necessária (EmailJS)**

### **1. Criar conta no EmailJS**
1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"**
3. Crie conta gratuita (300 emails/mês)

### **2. Configurar Service**
1. Dashboard → **"Email Services"** → **"Add New Service"**
2. Escolha seu provedor (Gmail, Outlook, etc.)
3. Configure suas credenciais de email
4. Anote o **Service ID** (ex: `service_libra_credito`)

### **3. Criar Templates de Email**

#### **Template 1: Notificação para Equipe**
```
Template ID: template_parceiro_admin
Subject: 🚨 Novo Parceiro: {{partner_name}} - {{partner_city}}

Corpo do email:
---
{{formatted_data}}

⚡ AÇÃO NECESSÁRIA:
Entre em contato com o parceiro em até 24h.

🔗 Acesse o dashboard: {{dashboard_link}}
---
```

#### **Template 2: Confirmação para Parceiro**
```
Template ID: template_parceiro_confirmacao
Subject: ✅ Cadastro Recebido - Libra Crédito Parceiros

Corpo do email:
---
Olá {{partner_name}},

Recebemos seu cadastro como parceiro da Libra Crédito em {{partner_city}}!

📋 INFORMAÇÕES RECEBIDAS:
• Nome: {{partner_name}}
• Ramo de Atuação: {{partner_business}}
• Data do Cadastro: {{submission_date}}

📞 PRÓXIMOS PASSOS:
1. Nossa equipe entrará em contato em até 24h
2. Avaliaremos seu perfil e compatibilidade
3. Enviaremos materiais e propostas comerciais
4. Agendaremos reunião de onboarding

Obrigado por escolher a Libra Crédito!

Atenciosamente,
Equipe Libra Crédito
{{contact_info}}
---
```

### **4. Atualizar Configurações no Código**

**Arquivo:** `src/services/emailService.ts`

```typescript
const EMAIL_CONFIG = {
  SERVICE_ID: 'seu_service_id_aqui',                    // ← Atualizar
  TEMPLATE_ID_ADMIN: 'template_parceiro_admin',         // ← Atualizar
  TEMPLATE_ID_PARTNER: 'template_parceiro_confirmacao', // ← Atualizar
  PUBLIC_KEY: 'sua_public_key_aqui',                    // ← Atualizar
  ADMIN_EMAIL: 'admin@libracredito.com.br',             // ← Atualizar
  FROM_NAME: 'Libra Crédito - Sistema Automático'
};
```

### **5. Obter Public Key**
1. Dashboard EmailJS → **"Account"** → **"General"**
2. Copiar **"Public Key"**
3. Colar em `PUBLIC_KEY` no código

---

## 🧪 **Como Testar**

### **Teste 1: Via Console**
```javascript
// No console do navegador (F12)
import('./src/services/emailService.js').then(module => {
  module.EmailService.testEmailConfiguration();
});
```

### **Teste 2: Cadastro Real**
1. Acesse `/parceiros`
2. Preencha formulário completo
3. Envie cadastro
4. Verifique console (F12) para logs
5. Verifique caixa de entrada do email configurado

### **Teste 3: Logs de Depuração**
```javascript
// Logs esperados no console:
✅ EmailJS inicializado com sucesso
📧 Iniciando envio de emails para novo parceiro: [NOME]
✅ Email enviado para equipe: [Response]
✅ Email de confirmação enviado para parceiro: [Response]
✅ Emails enviados automaticamente para novo parceiro
```

---

## 📋 **Template Variables Disponíveis**

### **Para Template da Equipe:**
```
{{to_email}}          - Email da equipe
{{from_name}}         - Nome do remetente
{{subject}}           - Assunto do email
{{partner_name}}      - Nome do parceiro
{{partner_email}}     - Email do parceiro
{{partner_phone}}     - Telefone do parceiro
{{partner_city}}      - Cidade do parceiro
{{partner_business}}  - Ramo de atuação
{{partner_experience}} - Experiência em Home Equity
{{partner_profile}}   - Perfil de cliente
{{partner_source}}    - Como conheceu a empresa
{{partner_cnpj}}      - CNPJ (opcional)
{{partner_message}}   - Mensagem adicional
{{submission_date}}   - Data/hora do cadastro
{{session_id}}        - ID da sessão
{{formatted_data}}    - Dados formatados completos
{{dashboard_link}}    - Link para o dashboard
```

### **Para Template do Parceiro:**
```
{{to_email}}          - Email do parceiro
{{to_name}}           - Nome do parceiro
{{from_name}}         - Nome do remetente
{{subject}}           - Assunto do email
{{partner_name}}      - Nome do parceiro
{{partner_city}}      - Cidade do parceiro
{{partner_business}}  - Ramo de atuação
{{submission_date}}   - Data/hora do cadastro
{{contact_info}}      - Informações de contato da empresa
```

---

## 🔧 **Troubleshooting**

### **❌ "EmailJS not initialized"**
**Causa:** Public Key não configurada  
**Solução:** Configurar `PUBLIC_KEY` no arquivo `emailService.ts`

### **❌ "Template not found"**
**Causa:** Template ID incorreto  
**Solução:** Verificar Template IDs no dashboard EmailJS

### **❌ "Service not found"**
**Causa:** Service ID incorreto  
**Solução:** Verificar Service ID no dashboard EmailJS

### **❌ "Emails not being sent"**
**Causa:** Configuração incompleta  
**Solução:** 
1. Verificar todas as configurações
2. Testar com `testEmailConfiguration()`
3. Verificar console do navegador

### **❌ "Email sent but not received"**
**Causa:** Filtro de spam  
**Solução:** 
1. Verificar pasta de spam
2. Adicionar EmailJS aos contatos confiáveis
3. Usar domínio próprio (recomendado para produção)

---

## 📊 **Status Atual**

**✅ Implementado:**
- [x] Serviço de email automático
- [x] Integração com formulário de parceiros
- [x] Templates profissionais
- [x] Logs detalhados
- [x] Tratamento de erros

**⚠️ Pendente:**
- [ ] Configurar conta EmailJS
- [ ] Criar templates no dashboard
- [ ] Atualizar chaves no código
- [ ] Testar envio real

---

## 🚀 **Próximos Passos**

### **Imediato (hoje):**
1. [ ] Criar conta EmailJS
2. [ ] Configurar service de email
3. [ ] Criar os 2 templates
4. [ ] Atualizar código com chaves
5. [ ] Testar funcionalidade

### **Opcional (futuro):**
- [ ] Usar domínio próprio para emails
- [ ] Implementar analytics de email
- [ ] Criar mais templates personalizados
- [ ] Integrar com CRM via webhook

---

## 🎊 **Benefícios Alcançados**

✅ **Notificação Instantânea** - Equipe recebe notificação imediata  
✅ **Dados Completos** - Todas informações formatadas profissionalmente  
✅ **Confirmação ao Cliente** - Parceiro recebe confirmação automática  
✅ **Não Bloqueia Processo** - Envio em background não afeta performance  
✅ **Logs Detalhados** - Rastreamento completo para debug  
✅ **Escalável** - Sistema preparado para grande volume  

**🚀 Sistema pronto para ativação!**