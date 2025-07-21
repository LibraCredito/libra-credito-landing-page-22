@echo off
echo 🖥️ COMMIT PRIMEIRA DOBRA
echo =======================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

git add .
git commit -m "feat: adjust Hero height for first fold visibility on desktop"
git push origin v23

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 PRIMEIRA DOBRA OTIMIZADA!
    echo.
    echo 🌐 https://librav1.vercel.app
    echo.
    echo ✅ Desktop: Ambas as faixas + Hero visíveis
    echo 📱 Mobile: Responsividade mantida
) else (
    echo ❌ Erro no push
)

pause