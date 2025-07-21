@echo off
echo 🌊 COMMIT E PUSH - EFEITO SANDUÍCHE DE ONDAS
echo ==========================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

git add .

git commit -m "feat: add inverted wave separator on top - sandwich effect"

git push origin v23

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 EFEITO SANDUÍCHE IMPLEMENTADO COM SUCESSO!
    echo.
    echo 🌐 https://librav1.vercel.app
    echo.
    echo 🌊 Faixa superior: Ondas invertidas
    echo 📄 Hero: Conectado perfeitamente  
    echo 🌊 Faixa inferior: Ondas normais
) else (
    echo ❌ Erro no push
)

pause