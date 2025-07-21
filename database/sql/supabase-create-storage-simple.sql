-- =====================================================
-- CRIAÇÃO SIMPLES DO BUCKET BLOG-IMAGES
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Dashboard → SQL Editor → New Query → Cole este código → Run

-- Inserir bucket blog-images na tabela storage.buckets
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES (
    'blog-images',
    'blog-images', 
    true,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE name = 'blog-images';