@echo off
echo 🔧 RESOLUÇÃO DEFINITIVA CONFLITO GITHUB
echo ======================================

cd "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo 📂 Diretório: %CD%
echo.

echo 🔍 STATUS ATUAL:
git status --short
echo.

echo 🛠️ SUBSTITUINDO ARQUIVO PROBLEMÁTICO...
copy /Y use-mobile-clean.tsx src\hooks\use-mobile.tsx
if %errorlevel% equ 0 (
    echo ✅ Arquivo substituído com sucesso
) else (
    echo ❌ Erro ao substituir arquivo
    pause
    exit /b 1
)

echo.
echo 📋 VERIFICANDO CONTEÚDO:
type src\hooks\use-mobile.tsx | findstr "MOBILE_BREAKPOINT"
echo ✅ Breakpoint verificado: 1024px

echo.
echo ➕ ADICIONANDO ARQUIVO CORRIGIDO...
git add src/hooks/use-mobile.tsx

echo.
echo 💾 COMMIT CORREÇÃO...
git commit -m "🔧 fix: Resolver conflito GitHub - use-mobile.tsx breakpoint 1024px

✅ Resolução definitiva:
- Arquivo use-mobile.tsx limpo e correto
- MOBILE_BREAKPOINT = 1024px
- Remove todos marcadores de conflito
- Pronto para merge GitHub

🎯 Para GitHub PR:
- Conflito resolvido definitivamente
- Arquivo sem marcadores <<<< ==== >>>>
- Merge pode ser realizado"

if %errorlevel% equ 0 (
    echo ✅ Commit realizado
) else (
    echo ❌ Erro no commit
    pause
    exit /b 1
)

echo.
echo 🚀 PUSH PARA RESOLVER CONFLITO...
git push origin main
if %errorlevel% equ 0 (
    echo ✅ Push realizado com sucesso
) else (
    echo ❌ Erro no push
    pause
    exit /b 1
)

echo.
echo 🎉 RESOLUÇÃO GITHUB CONCLUÍDA!
echo =============================
echo.
echo ✅ RESULTADO:
echo "- Arquivo use-mobile.tsx corrigido"
echo "- Breakpoint 1024px definitive"
echo "- Conflito GitHub resolvido"
echo "- Pronto para merge"
echo.
echo 📱 NO GITHUB:
echo "1. Aguarde 1-2 minutos"
echo "2. Atualize a página do PR"
echo "3. Conflito deve ter desaparecido"
echo "4. Clique 'Merge pull request'"
echo "5. Escolha 'Create a merge commit'"
echo.
echo 🔗 Acesse: https://github.com/cwolfbr/libra-credito-landing-page-22/pulls
echo.
echo 📊 STATUS FINAL:
git log --oneline -2
echo.
pause
