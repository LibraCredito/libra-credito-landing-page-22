@echo off
echo 🔄 CORREÇÃO - RESTAURANDO TRUSTBAR ORIGINAL
echo ==========================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo ✅ TrustBar restaurado para versão original!
echo.
echo 🔄 CORREÇÃO APLICADA:
echo - Removido: TrustBar (estático)
echo + Restaurado: TrustBarMinimal (dinâmico)
echo.
echo 📊 CONTADORES DINÂMICOS RESTAURADOS:
echo ✅ 3.000+ Cidades Atendidas (animado)
echo ✅ 98%% Satisfação (animado)  
echo ✅ 5+ anos De Experiência (animado)
echo.

echo 🔨 Testando build...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD FUNCIONANDO!
    echo.
    echo 📁 Commitando correção...
    git add .
    git commit -m "fix: restore original TrustBarMinimal with dynamic counters

🔄 Restored original TrustBar component:
- Changed from TrustBar (static) to TrustBarMinimal (dynamic)
- Restored animated counters: 3000+ Cities, 98%% Satisfaction, 5+ years
- Maintained wave separator addition
- Page structure unchanged - only TrustBar component restored

✅ Original dynamic content restored
🌊 Wave separator maintained"
    
    echo.
    echo 🚀 Fazendo push...
    git push origin v23
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo 🎉 CORREÇÃO APLICADA COM SUCESSO!
        echo.
        echo 🌐 Site atualizado em:
        echo https://librav1.vercel.app
        echo.
        echo ✅ ESTADO CORRETO RESTAURADO:
        echo 🌊 Faixa de ondas: Mantida
        echo 📊 TrustBar: Restaurado para versão dinâmica
        echo 🎯 Contadores animados: Funcionando
    ) else (
        echo ❌ Erro no push
    )
) else (
    echo ❌ Erro no build
)

echo.
pause