-- =====================================================
-- CRIAÇÃO DO BUCKET BLOG-IMAGES
-- =====================================================
-- Execute este script no SQL Editor do Supabase para criar o bucket
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

-- Criar políticas de acesso para o bucket blog-images
-- 1. Permitir SELECT (visualizar) para todos
INSERT INTO storage.policies (id, bucket_id, command, definition, check_definition, created_at, updated_at)
VALUES (
    'blog-images-select-policy',
    'blog-images',
    'SELECT',
    'true',
    'true',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir INSERT (upload) para todos
INSERT INTO storage.policies (id, bucket_id, command, definition, check_definition, created_at, updated_at)
VALUES (
    'blog-images-insert-policy',
    'blog-images',
    'INSERT',
    'true',
    'true',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Permitir UPDATE para todos
INSERT INTO storage.policies (id, bucket_id, command, definition, check_definition, created_at, updated_at)
VALUES (
    'blog-images-update-policy',
    'blog-images',
    'UPDATE',
    'true',
    'true',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 4. Permitir DELETE para todos
INSERT INTO storage.policies (id, bucket_id, command, definition, check_definition, created_at, updated_at)
VALUES (
    'blog-images-delete-policy',
    'blog-images',
    'DELETE',
    'true',
    'true',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE name = 'blog-images';

-- Verificar as políticas
SELECT * FROM storage.policies WHERE bucket_id = 'blog-images';