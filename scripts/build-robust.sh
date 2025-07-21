#!/bin/bash

echo "🚀 BUILD SCRIPT ROBUSTO PARA VERCEL"
echo "===================================="

# Verificar se estamos no ambiente Linux (Vercel)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Ambiente Linux detectado (Vercel)"
    
    # Tentar instalar dependências rollup específicas do Linux
    echo "📦 Instalando dependências Rollup para Linux..."
    npm install @rollup/rollup-linux-x64-gnu --save-optional --no-save
    
elif [[ "$OSTYPE" == "win32" || "$OSTYPE" == "msys" ]]; then
    echo "🪟 Ambiente Windows detectado"
    
    # Tentar instalar dependências rollup específicas do Windows
    echo "📦 Instalando dependências Rollup para Windows..."
    npm install @rollup/rollup-win32-x64-msvc --save-optional --no-save
fi

echo "🔨 Executando build..."
npx vite build

echo "✅ Build concluído!"
