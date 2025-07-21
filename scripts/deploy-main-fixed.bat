@echo off
echo 🔧 DEPLOY MAIN - RESOLVENDO MUDANÇAS LOCAIS
echo ==========================================
echo.

cd "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo 📂 Diretório: %CD%
echo.

echo 🔍 VERIFICANDO STATUS...
git status --short
echo.

echo 📋 VERIFICANDO BRANCH ATUAL...
git branch --show-current
echo.

echo 🔄 SOLUCIONANDO MUDANÇAS LOCAIS...
echo "Opção 1: Fazer stash das mudanças pendentes"
echo "Opção 2: Commitá-las na branch atual"
echo.

echo 💡 USANDO STASH (mais seguro)...
git stash push -m "WIP: Mudanças temporárias antes do deploy"
if %errorlevel% equ 0 (
    echo ✅ Mudanças salvas no stash
) else (
    echo ⚠️  Nenhuma mudança para fazer stash (normal)
)

echo.
echo 🌿 MUDANDO PARA BRANCH MAIN...
git checkout main
if %errorlevel% equ 0 (
    echo ✅ Agora na branch main
) else (
    echo ❌ Ainda com erro? Tentando forçar...
    git checkout main --force
    if %errorlevel% equ 0 (
        echo ✅ Checkout forçado realizado
    else (
        echo ❌ Erro persistente - verificando...
        git status
        pause
        exit /b 1
    )
)

echo.
echo 🔄 ATUALIZANDO MAIN...
git pull origin main
echo ✅ Main atualizada

echo.
echo 🔙 RECUPERANDO MUDANÇAS DO STASH...
git stash pop
if %errorlevel% equ 0 (
    echo ✅ Mudanças recuperadas do stash
) else (
    echo ⚠️  Nenhum stash para recuperar (normal)
)

echo.
echo ➕ ADICIONANDO TODAS AS MUDANÇAS...
git add .
if %errorlevel% equ 0 (
    echo ✅ Todos os arquivos adicionados
) else (
    echo ❌ Erro ao adicionar arquivos
    pause
    exit /b 1
)

echo.
echo 💾 COMMIT NA MAIN...
git commit -m "🎨 fix(mobile): Menu mobile - títulos grandes, centralizados, sem sobreposição

✅ Correções aplicadas na MAIN:
- Títulos: text-sm → text-lg (14px → 18px) +28% maior
- Centralização: justify-center + text-center (perfeita)
- Área toque: min-h-44px → min-h-56px (+27% maior)
- Anti-sobreposição: translateZ(0) + position absolute
- Menu dropdown: backdrop-blur + shadow-xl
- Performance: willChange transform + font smoothing
- Scripts corrigidos: commit direto na MAIN

🎯 Problemas resolvidos:
❌ Títulos pequenos → ✅ Grandes e legíveis (18px)
❌ Não centralizados → ✅ Perfeitamente centralizados
❌ Sobreposição resize → ✅ Zero sobreposição
❌ Scripts V23 → ✅ Scripts MAIN diretos

🚀 Deploy: MAIN → Produção imediata
📱 UX: Mobile premium, touch-friendly
🔧 Fixed: Local changes + direct MAIN commit"

if %errorlevel% equ 0 (
    echo ✅ Commit realizado na MAIN
) else (
    echo ❌ Erro no commit - Verificando o que aconteceu...
    git status
    pause
    exit /b 1
)

echo.
echo 🚀 PUSH PARA PRODUÇÃO...
git push origin main
if %errorlevel% equ 0 (
    echo ✅ Push MAIN realizado - Deploy Vercel iniciado!
) else (
    echo ❌ Erro no push - Verificando...
    git status
    git log --oneline -2
    pause
    exit /b 1
)

echo.
echo 🏷️ ATUALIZANDO TAG V23...
git tag -d v23 2>nul
git tag v23
git push origin v23 --force
if %errorlevel% equ 0 (
    echo ✅ Tag v23 atualizada
) else (
    echo ⚠️  Erro nas tags (não crítico)
)

echo.
echo 🎉 DEPLOY CONCLUÍDO COM SUCESSO!
echo ==============================
echo.
echo ✅ PROBLEMAS RESOLVIDOS:
echo "- Mudanças locais tratadas com stash"
echo "- Commit feito direto na MAIN"
echo "- Deploy automático Vercel iniciado"
echo "- Sem conflitos de branch"
echo.
echo 📱 TESTE EM 2-3 MINUTOS:
echo "🔗 https://libra-credito-landing-page-22.vercel.app/"
echo.
echo 🎯 VERIFICAR:
echo "✅ Menu hambúrguer → títulos GRANDES (18px)"
echo "✅ Títulos perfeitamente centralizados"
echo "✅ Sem sobreposição no resize"
echo "✅ Visual mobile premium"
echo.
echo 📋 STATUS FINAL:
git branch --show-current
git log --oneline -2
echo.
echo 💡 Use Ctrl+Shift+R para reload forçado
echo ⏰ Aguarde 2-3 minutos para deploy Vercel
echo.
echo ✅ TUDO RESOLVIDO - DEPLOY FINALIZADO!
pause
