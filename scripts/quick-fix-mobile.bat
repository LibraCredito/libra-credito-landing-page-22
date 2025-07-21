@echo off
echo 📱 CORREÇÃO MOBILE RÁPIDA
echo ========================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

git add .
git commit -m "fix: improve mobile layout while maintaining desktop first fold"
git push origin v23

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 MOBILE CORRIGIDO!
    echo.
    echo 🌐 https://librav1.vercel.app
    echo.
    echo ✅ RESULTADO:
    echo 📱 Mobile: Layout bonito e legível
    echo 🖥️ Desktop: Primeira dobra mantida
) else (
    echo ❌ Erro no push
)

pause