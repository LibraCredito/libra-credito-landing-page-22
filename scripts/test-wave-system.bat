@echo off
echo 🌊 TESTE E DEPLOY - SISTEMA DE ONDAS LIBRA CRÉDITO
echo ================================================

echo.
echo 📋 ARQUIVOS CRIADOS:
echo ✅ WaveSeparator.tsx - Componente principal das ondas
echo ✅ RateHighlight.tsx - Seção de destaque da taxa 1,19%%
echo ✅ Index.tsx modificado - Integração na posição exata
echo.

echo 🔨 Testando se o projeto compila...
cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD FUNCIONANDO! Projeto compila sem erros.
    echo.
    echo 🎯 SISTEMA DE ONDAS IMPLEMENTADO:
    echo.
    echo 📍 Posição: Entre Hero e seção de taxa
    echo 🌊 Faixa: 3 camadas com opacidades 25%%, 50%%, 100%%
    echo 🎨 Cores: #003399 (azul) para branco
    echo 📱 Responsivo: 120px → 80px → 60px
    echo ⚡ Performance: Versão estática otimizada
    echo.
    echo 🚀 COMANDOS PARA COMMIT E DEPLOY:
    echo.
    echo git add .
    echo git commit -m "feat: implement wave separator design system with 3-layer depth effect"
    echo git push origin main
    echo.
    echo 🌐 Após o push, site atualizado em:
    echo https://librav1.vercel.app
    echo.
    echo 🎉 PRONTO PARA DEPLOY!
) else (
    echo.
    echo ❌ ERRO NO BUILD! Verificar problemas:
    echo.
    echo 1. Verificar se todas as dependências estão instaladas
    echo 2. Verificar erros de TypeScript no console acima
    echo 3. Corrigir imports se necessário
    echo.
    echo 🔧 Para corrigir:
    echo npm install
    echo npm run build
)

echo.
echo Pressione qualquer tecla para continuar...
pause >nul