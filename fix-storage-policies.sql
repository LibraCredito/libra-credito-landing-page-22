-- =====================================================
-- CORRIGIR POLÍTICAS DO BUCKET BLOG-IMAGES
-- =====================================================
-- Execute no SQL Editor do Supabase para corrigir as políticas

-- Habilitar RLS na tabela storage.objects se não estiver
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (visualizar arquivos)
CREATE POLICY "Enable select for all users" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Política para INSERT (upload de arquivos)
CREATE POLICY "Enable insert for all users" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images');

-- Política para UPDATE (atualizar arquivos)
CREATE POLICY "Enable update for all users" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images');

-- Política para DELETE (deletar arquivos)
CREATE POLICY "Enable delete for all users" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images');

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';