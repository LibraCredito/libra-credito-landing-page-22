@echo off
echo 🌊 DEPLOY MINIMALISTA - APENAS FAIXA SEPARADORA
echo ==============================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo ✅ Modificação minimalista aplicada!
echo.
echo 📋 O QUE FOI ALTERADO:
echo + Adicionado WaveSeparator.tsx (componente da faixa)
echo + Adicionado import no Index.tsx  
echo + Adicionado ^<WaveSeparator^> entre Hero e TrustBar
echo - Removido RateHighlight.tsx (extra desnecessário)
echo.
echo ✅ PÁGINA MANTIDA ORIGINAL - apenas faixa adicionada!
echo.

echo 🔨 Testando build...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD FUNCIONANDO!
    echo.
    echo 📁 Fazendo commit das mudanças mínimas...
    git add .
    git commit -m "feat: add wave separator only - minimal change

✨ Added only WaveSeparator component:
- WaveSeparator.tsx with 3-layer depth effect (25%%, 50%%, 100%%)
- Positioned between Hero and TrustBar sections
- Brand colors: #003399 to white transition  
- Responsive: 120px desktop, 80px tablet, 60px mobile
- Static implementation for optimal performance

🎯 Minimal modification - page structure unchanged
🌊 Only added wave separator, nothing else modified"
    
    echo.
    echo 🚀 Fazendo push...
    git push origin v23
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo 🎉 DEPLOY MINIMALISTA REALIZADO!
        echo.
        echo 🌐 Site atualizado em:
        echo https://librav1.vercel.app
        echo.
        echo ✅ APENAS A FAIXA FOI ADICIONADA!
        echo 🌊 Página original mantida intacta
        echo 📍 Faixa posicionada entre Hero e TrustBar
        echo 🎨 3 camadas de profundidade visual ativas
    ) else (
        echo ❌ Erro no push
    )
) else (
    echo ❌ Erro no build
)

echo.
pause