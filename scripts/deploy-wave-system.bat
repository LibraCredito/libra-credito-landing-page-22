@echo off
echo 🌊 COMMIT E PUSH - SISTEMA DE ONDAS LIBRA CRÉDITO
echo ===============================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo 📋 Verificando status do Git...
git status

echo.
echo 🔨 Testando build final...
npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro no build! Corrija antes de continuar.
    pause
    exit /b 1
)

echo.
echo ✅ Build funcionando!
echo.
echo 📁 Adicionando arquivos...
git add .

echo.
echo 💾 Fazendo commit...
git commit -m "feat: implement wave separator design system

✨ Add WaveSeparator component with 3-layer depth effect:
- Created WaveSeparator.tsx with 25%%, 50%%, 100%% opacity layers
- Added RateHighlight.tsx section matching Libra original design  
- Modified Index.tsx to place wave separator in exact position
- Brand colors: #003399 (blue) to white transition
- Responsive: 120px desktop, 80px tablet, 60px mobile
- Static implementation for optimal performance

📍 Strategic placement between Hero and rate section
🎯 Replicates exact Libra Crédito wave separator design
🚀 Ready for expansion across entire site"

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro no commit!
    pause
    exit /b 1
)

echo ✅ Commit realizado!

echo.
echo 🚀 Fazendo push...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 DEPLOY REALIZADO COM SUCESSO!
    echo.
    echo 🌐 Site será atualizado em 1-3 minutos:
    echo https://librav1.vercel.app
    echo.
    echo 🎯 IMPLEMENTAÇÃO COMPLETA:
    echo ✅ Faixa separadora na posição exata da Libra
    echo ✅ 3 camadas de profundidade visual 
    echo ✅ Cores da marca (#003399 para branco)
    echo ✅ Seção de taxa 1,19%% destacada
    echo ✅ Sistema responsivo e otimizado
    echo.
    echo 🌊 SISTEMA DE ONDAS ATIVO!
    echo Pronto para expansão para outras seções.
) else (
    echo ❌ Erro no push! Verificar conexão.
)

echo.
pause