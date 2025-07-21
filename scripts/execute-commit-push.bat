@echo off
echo 🚀 COMMIT E PUSH - CORREÇÃO TRUSTBAR
echo ====================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo 📁 Adicionando arquivos...
git add .

echo 💾 Fazendo commit...
git commit -m "fix: restore original TrustBarMinimal with dynamic counters

🔄 Restored original TrustBar component:
- Changed from TrustBar (static) to TrustBarMinimal (dynamic) 
- Restored animated counters: 3000+ Cities, 98%% Satisfaction, 5+ years
- Maintained wave separator addition
- Page structure unchanged - only TrustBar component restored

✅ Original dynamic content restored
🌊 Wave separator maintained"

echo 🚀 Fazendo push...
git push origin v23

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 COMMIT E PUSH REALIZADOS COM SUCESSO!
    echo.
    echo 🌐 Site será atualizado em 1-3 minutos:
    echo https://librav1.vercel.app
    echo.
    echo ✅ ESTADO FINAL:
    echo 🌊 Faixa de ondas: Mantida
    echo 📊 TrustBar: Restaurado para versão dinâmica original
    echo 🎯 Contadores animados: 3000+ cidades, 98%% satisfação, 5+ anos
) else (
    echo ❌ Erro no push
)

echo.
echo Finalizado!
pause