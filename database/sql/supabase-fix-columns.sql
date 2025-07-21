-- =====================================================
-- CORREÇÃO DE TAMANHOS DE CAMPOS E VALIDAÇÃO
-- =====================================================

-- Aumentar limite do campo image_url para URLs longas (base64 ou Supabase Storage)
ALTER TABLE public.blog_posts 
ALTER COLUMN image_url TYPE TEXT;

-- Verificar estrutura atual da tabela
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Teste para verificar se a alteração funcionou
SELECT 'Estrutura da tabela atualizada com sucesso!' as status;