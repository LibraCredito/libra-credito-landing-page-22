@echo off
echo 🚀 SCRIPT DE BUILD ROBUSTO - LIBRA CREDITO
echo ==========================================

REM 1. Verificar versão do Node
echo 📋 Verificando versão do Node...
node --version
npm --version

REM 2. Limpeza completa
echo 🗑️ Limpeza completa...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist dist rmdir /s /q dist

REM 3. Limpar cache
echo 🧹 Limpando cache...
npm cache clean --force

REM 4. Reinstalar dependências
echo 📥 Reinstalando dependências...
npm install --legacy-peer-deps --no-optional

REM 5. Build
echo 🔨 Executando build...
set NODE_OPTIONS=--max-old-space-size=4096
npm run build

REM 6. Verificar se build foi criado
if exist dist (
    echo ✅ Build criado com sucesso!
    dir dist
) else (
    echo ❌ Falha no build!
    exit /b 1
)

echo 🎉 Script concluído!
pause
