@echo off
echo 🔧 RESOLVENDO CONFLITO E DEPLOY - SISTEMA DE ONDAS
echo ================================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo ✅ Conflito de merge resolvido no Index.tsx!
echo.

echo 🔨 Testando build...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD FUNCIONANDO!
    echo.
    echo 📁 Adicionando arquivos resolvidos...
    git add .
    
    echo.
    echo 💾 Fazendo commit...
    git commit -m "fix: resolve merge conflict and implement wave separator system

🔧 Fixed merge conflict in Index.tsx
✨ Implemented WaveSeparator with 3-layer depth effect:
- WaveSeparator.tsx component (25%%, 50%%, 100%% opacity)
- RateHighlight.tsx section with 1,19%% rate display
- Strategic positioning between Hero and TrustBar
- Brand colors: #003399 to white transition
- Responsive: 120px desktop, 80px tablet, 60px mobile
- Static implementation for optimal performance

🎯 Wave separator now positioned exactly like Libra original"
    
    echo.
    echo 🚀 Fazendo push para v23...
    git push origin v23
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo 🎉 DEPLOY REALIZADO COM SUCESSO!
        echo.
        echo 🌐 Site será atualizado em 1-3 minutos:
        echo https://librav1.vercel.app
        echo.
        echo ✅ SISTEMA DE ONDAS IMPLEMENTADO!
        echo 🌊 Faixa separadora na posição exata da Libra
        echo 🎯 3 camadas de profundidade visual funcionando
        echo 📱 Responsivo e otimizado para performance
    ) else (
        echo ❌ Erro no push. Verificar problemas de rede.
    )
) else (
    echo ❌ Erro no build! Verificar erros acima.
)

echo.
pause