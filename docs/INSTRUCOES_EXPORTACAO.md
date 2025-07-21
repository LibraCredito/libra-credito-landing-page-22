# 📋 Instruções Completas para Exportação de Dados

## 🎯 Objetivo
Exportar todos os dados da conta Supabase original para importar na nova conta.

## 🚀 Passo a Passo

### 1. **Acesse a Conta Original Supabase**
- URL: `https://plqljbugvhrffmvdsmsb.supabase.co`
- Vá em **Dashboard → SQL Editor → New Query**

### 2. **Execute os Comandos de Exportação**
Abra o arquivo `supabase-export-data.sql` e execute **um comando por vez**:

#### 2.1. **Primeiro - Verifique as tabelas existentes:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('simulacoes', 'user_journey', 'blog_posts', 'posts', 'blog_categories', 'parceiros', 'data_cleanup_log')
ORDER BY table_name;
```

#### 2.2. **Conte os registros:**
Execute o comando de contagem do final do arquivo para saber quantos dados você tem.

#### 2.3. **Exporte cada tabela:**
Execute os comandos de exportação **um por vez** e salve os resultados:

1. **Simulações** → Salve como `simulacoes_export.sql`
2. **User Journey** → Salve como `user_journey_export.sql`  
3. **Blog Posts** → Salve como `blog_posts_export.sql`
4. **Posts** (se existir) → Salve como `posts_export.sql`
5. **Blog Categories** → Salve como `blog_categories_export.sql`
6. **Parceiros** → Salve como `parceiros_export.sql`
7. **Data Cleanup Log** (se existir) → Salve como `data_cleanup_log_export.sql`

### 3. **Organizar os Arquivos**
Crie uma pasta `exports/` e coloque todos os arquivos `.sql` lá:
```
exports/
├── simulacoes_export.sql
├── user_journey_export.sql
├── blog_posts_export.sql
├── posts_export.sql (se existir)
├── blog_categories_export.sql
├── parceiros_export.sql
└── data_cleanup_log_export.sql (se existir)
```

### 4. **Importar na Nova Conta**
Acesse a nova conta: `https://wprklqdnmibxphiofqk.supabase.co`

#### **Ordem de Importação (IMPORTANTE!):**
1. `blog_categories_export.sql` (primeiro - é referenciado por outras tabelas)
2. `simulacoes_export.sql`
3. `user_journey_export.sql`
4. `blog_posts_export.sql`
5. `posts_export.sql` (se existir)
6. `parceiros_export.sql`
7. `data_cleanup_log_export.sql` (se existir - último)

### 5. **Verificação**
Após importar tudo, execute na nova conta:
```sql
SELECT 
    'simulacoes' as tabela,
    COUNT(*) as total_registros
FROM public.simulacoes
UNION ALL
SELECT 
    'user_journey' as tabela,
    COUNT(*) as total_registros
FROM public.user_journey
UNION ALL
SELECT 
    'blog_posts' as tabela,
    COUNT(*) as total_registros
FROM public.blog_posts
UNION ALL
SELECT 
    'blog_categories' as tabela,
    COUNT(*) as total_registros
FROM public.blog_categories
UNION ALL
SELECT 
    'parceiros' as tabela,
    COUNT(*) as total_registros
FROM public.parceiros
ORDER BY tabela;
```

Compare os números com a conta original para confirmar que tudo foi importado.

## ⚠️ Dicas Importantes

### **Se der erro de dados muito grandes:**
Se alguma consulta der timeout ou erro, divida em partes menores:
```sql
-- Exemplo para simulações - exportar por período
SELECT ... FROM public.simulacoes 
WHERE created_at >= '2024-01-01' AND created_at < '2024-06-01';

SELECT ... FROM public.simulacoes 
WHERE created_at >= '2024-06-01';
```

### **Para imagens do Storage:**
As imagens do bucket `blog-images` precisam ser baixadas e re-uploadadas manualmente:
1. Acesse **Storage → blog-images** na conta original
2. Baixe todas as imagens
3. Faça upload na nova conta no mesmo bucket

### **Se houver muitos dados:**
Para grandes volumes, considere usar ferramentas como:
- `pg_dump` (se tiver acesso)
- Supabase CLI
- Scripts de migração customizados

## 🆘 Suporte
Se encontrar algum problema durante a exportação, me informe:
- Qual comando deu erro
- Quantos registros tem cada tabela
- Se precisa dividir a exportação em partes menores

**Começe executando o primeiro comando de verificação das tabelas e me conte o que encontrou!**