#!/bin/bash

echo "🚀 SCRIPT DE BUILD ROBUSTO - LIBRA CRÉDITO"
echo "=========================================="

# 1. Verificar versão do Node
echo "📋 Verificando versão do Node..."
node --version
npm --version

# 2. Limpeza completa
echo "🗑️ Limpeza completa..."
rm -rf node_modules
rm -f package-lock.json
rm -rf dist

# 3. Limpar cache
echo "🧹 Limpando cache..."
npm cache clean --force

# 4. Reinstalar dependências
echo "📥 Reinstalando dependências..."
npm install --legacy-peer-deps --no-optional

# 5. Build
echo "🔨 Executando build..."
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# 6. Verificar se build foi criado
if [ -d "dist" ]; then
    echo "✅ Build criado com sucesso!"
    ls -la dist/
else
    echo "❌ Falha no build!"
    exit 1
fi

echo "🎉 Script concluído!"
