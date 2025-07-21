@echo off
echo 🚨 CONFLITO GIT DETECTADO - RESOLUÇÃO AUTOMÁTICA
echo ==============================================

cd "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo.
echo 🔍 SITUAÇÃO ATUAL:
echo "- Conflito no arquivo: src/hooks/use-mobile.tsx"
echo "- Causa: Versões diferentes do breakpoint mobile"
echo "- Nossa versão: MOBILE_BREAKPOINT = 1024 (CORRETO)"
echo "- Versão remota: MOBILE_BREAKPOINT = 768 (ANTIGO)"
echo.

echo 💡 ESTRATÉGIA DE RESOLUÇÃO:
echo "Vamos aceitar NOSSA versão (1024px) que resolve o problema"
echo "reportado de quebras de layout."
echo.

echo ⚠️  ATENÇÃO: Isso vai:
echo "1. Aceitar nossa versão do arquivo (breakpoint 1024px)"
echo "2. Finalizar o merge automaticamente"
echo "3. Fazer push para o repositório"
echo "4. Continuar o deploy no Vercel"
echo.

echo 🤔 Continuar com a resolução automática? (S/N)
set /p confirm=Digite S para continuar ou N para cancelar: 

if /I "%confirm%" NEQ "S" (
    echo ❌ Resolução cancelada pelo usuário
    echo.
    echo 📝 Para resolver manualmente:
    echo "1. Abra o arquivo src/hooks/use-mobile.tsx"
    echo "2. Mantenha: const MOBILE_BREAKPOINT = 1024"
    echo "3. Remova marcadores de conflito (^^^<<<<, ====, >>>>)"
    echo "4. Execute: git add . && git commit && git push origin main"
    pause
    exit /b
)

echo.
echo 🚀 INICIANDO RESOLUÇÃO AUTOMÁTICA...
echo.

echo 📋 Verificando status...
git status --short

echo.
echo ✅ Aceitando nossa versão (breakpoint 1024px)...
git checkout --ours src/hooks/use-mobile.tsx

echo ➕ Marcando como resolvido...
git add src/hooks/use-mobile.tsx

echo 💾 Finalizando merge...
git commit --no-edit

echo 🚀 Enviando para repositório...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 SUCESSO! CONFLITO RESOLVIDO!
    echo ============================
    echo.
    echo ✅ RESULTADO:
    echo "- Conflito resolvido automaticamente"
    echo "- Breakpoint mantido em 1024px (CORRETO)"
    echo "- Deploy Vercel deve continuar"
    echo "- Menu lateral agora ativa antes das quebras"
    echo.
    echo 📱 TESTE EM 2-3 MINUTOS:
    echo "🔗 https://libra-credito-landing-page-22.vercel.app/"
    echo.
    echo 🧪 COMO TESTAR:
    echo "1. Redimensione a janela do navegador"
    echo "2. Em 1024px → menu lateral deve aparecer"
    echo "3. Logo nunca mais cortado"
    echo "4. Botões nunca mais sobrepostos"
    echo.
) else (
    echo.
    echo ❌ ERRO NA RESOLUÇÃO
    echo "Verifique o status e tente novamente"
    git status
)

echo.
echo 📋 STATUS FINAL:
git log --oneline -2
echo.
pause
