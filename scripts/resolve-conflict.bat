@echo off
echo 🔧 RESOLVENDO CONFLITO GIT - use-mobile.tsx
echo ==========================================

cd "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo 📂 Diretório: %CD%
echo.

echo 🔍 VERIFICANDO STATUS DO CONFLITO...
git status
echo.

echo 📋 ARQUIVOS EM CONFLITO:
git diff --name-only --diff-filter=U
echo.

echo 🛠️ RESOLVENDO CONFLITO AUTOMATICAMENTE...
echo "Aceitando nossa versão (breakpoint 1024px)"
echo.

echo ✅ RESOLVENDO src/hooks/use-mobile.tsx...
git checkout --ours src/hooks/use-mobile.tsx
if %errorlevel% equ 0 (
    echo ✅ Conflito resolvido - nossa versão aceita
) else (
    echo ❌ Erro ao resolver conflito
    pause
    exit /b 1
)

echo.
echo ➕ MARCANDO COMO RESOLVIDO...
git add src/hooks/use-mobile.tsx
if %errorlevel% equ 0 (
    echo ✅ Arquivo marcado como resolvido
) else (
    echo ❌ Erro ao marcar resolução
    pause
    exit /b 1
)

echo.
echo 🔍 VERIFICANDO SE HÁ OUTROS CONFLITOS...
git status --porcelain | findstr "^UU\|^AA\|^DD"
if %errorlevel% equ 0 (
    echo ⚠️ Ainda há conflitos não resolvidos
    git status
    pause
    exit /b 1
) else (
    echo ✅ Todos os conflitos resolvidos
)

echo.
echo 💾 FINALIZANDO MERGE...
git commit --no-edit
if %errorlevel% equ 0 (
    echo ✅ Merge finalizado com sucesso
) else (
    echo ❌ Erro ao finalizar merge
    git status
    pause
    exit /b 1
)

echo.
echo 🚀 FAZENDO PUSH...
git push origin main
if %errorlevel% equ 0 (
    echo ✅ Push realizado com sucesso
) else (
    echo ❌ Erro no push
    git status
    pause
    exit /b 1
)

echo.
echo 🎉 CONFLITO RESOLVIDO COM SUCESSO!
echo ================================
echo.
echo ✅ RESULTADO:
echo "- Conflito em use-mobile.tsx resolvido"
echo "- Nossa versão mantida (breakpoint 1024px)"
echo "- Merge finalizado e enviado"
echo "- Deploy Vercel deve continuar automaticamente"
echo.
echo 📱 TESTE EM 2-3 MINUTOS:
echo "🔗 https://libra-credito-landing-page-22.vercel.app/"
echo.
echo 🎯 VERIFICAR:
echo "- Redimensione a janela"
echo "- Menu lateral deve aparecer em 1024px"
echo "- Sem quebras de layout"
echo.
echo 📋 STATUS FINAL:
git log --oneline -2
echo.
pause
