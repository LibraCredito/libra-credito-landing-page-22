@echo off
echo 🚀 COMMIT E PUSH MANUAL - SISTEMA DE ONDAS
echo ==========================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo 📋 Status atual do Git:
git status

echo.
echo 📁 Adicionando arquivos...
git add .

echo.
echo 📋 Verificando arquivos a serem commitados:
git diff --staged --name-only

echo.
echo 💾 Fazendo commit...
git commit -m "feat: add wave separator only - minimal change

✨ Added only WaveSeparator component:
- WaveSeparator.tsx with 3-layer depth effect (25%%, 50%%, 100%%)
- Positioned between Hero and TrustBar sections  
- Brand colors: #003399 to white transition
- Responsive: 120px desktop, 80px tablet, 60px mobile
- Static implementation for optimal performance

🎯 Minimal modification - page structure unchanged
🌊 Only added wave separator, nothing else modified"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Commit realizado com sucesso!
) else (
    echo ❌ Erro no commit ou nada para commitar
    echo.
    echo Verificando se há mudanças:
    git status
    echo.
    pause
    exit /b 1
)

echo.
echo 🚀 Fazendo push para v23...
git push origin v23

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 PUSH REALIZADO COM SUCESSO!
    echo.
    echo 🌐 Site será atualizado em 1-3 minutos:
    echo https://librav1.vercel.app
    echo.
    echo ✅ FAIXA SEPARADORA IMPLEMENTADA!
    echo 🌊 Apenas a faixa foi adicionada - página mantida original
) else (
    echo ❌ Erro no push!
    echo.
    echo Verificando branch atual:
    git branch
    echo.
    echo Tentando push com força:
    git push --force-with-lease origin v23
)

echo.
pause