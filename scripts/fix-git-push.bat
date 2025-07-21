@echo off
echo 🔧 CORREÇÃO GIT - BRANCH E PUSH
echo ================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo 📋 Status atual do Git:
git status

echo.
echo 🌿 Verificando branches disponíveis:
git branch -a

echo.
echo 🔍 Verificando se branch main existe:
git show-ref --verify refs/heads/main
if %ERRORLEVEL% EQU 0 (
    echo ✅ Branch main existe localmente
) else (
    echo ❌ Branch main NÃO existe localmente
    echo.
    echo 🔄 Criando branch main a partir da atual:
    git checkout -b main
)

echo.
echo 📥 Fazendo pull das mudanças remotas da v23:
git pull origin v23

echo.
echo 📋 Status após pull:
git status

echo.
echo 📁 Verificando se há mudanças não commitadas:
git diff --name-only

echo.
echo 💾 Adicionando arquivos e fazendo commit:
git add .
git commit -m "feat: implement wave separator design system

✨ Add WaveSeparator component with 3-layer depth effect:
- WaveSeparator.tsx with 25%%, 50%%, 100%% opacity layers
- RateHighlight.tsx matching Libra original design
- Modified Index.tsx for exact positioning
- Brand colors: #003399 to white transition
- Responsive: 120px desktop, 80px tablet, 60px mobile
- Static implementation for optimal performance

🎯 Strategic placement between Hero and rate section"

echo.
echo 🚀 Fazendo push para v23 (branch atual):
git push origin v23

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 PUSH REALIZADO COM SUCESSO!
    echo.
    echo 🌐 Site será atualizado em:
    echo https://librav1.vercel.app
    echo.
    echo ✅ Mudanças enviadas para branch v23
    echo 🌊 Sistema de ondas implementado!
) else (
    echo ❌ Erro no push. Tentando forçar push:
    git push --force-with-lease origin v23
)

echo.
pause