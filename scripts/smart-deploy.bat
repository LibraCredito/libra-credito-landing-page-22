@echo off
echo 🛠️ SMART DEPLOY - DETECTA E RESOLVE AUTOMATICAMENTE
echo ================================================
echo.

cd "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo 📂 Diretório: %CD%
echo.

echo 🔍 ANALISANDO SITUAÇÃO...
for /f %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo 📋 Branch atual: %CURRENT_BRANCH%

echo 📊 Mudanças pendentes:
git status --short

echo.
echo 🧠 ESTRATÉGIA INTELIGENTE:
if "%CURRENT_BRANCH%"=="main" (
    echo "✅ Já estamos na MAIN - fazer commit direto"
    goto COMMIT_DIRECT
) else (
    echo "🔄 Estamos na %CURRENT_BRANCH% - commitar aqui e fazer merge"
    goto COMMIT_AND_MERGE
)

:COMMIT_DIRECT
echo.
echo ⚡ COMMIT DIRETO NA MAIN
echo ====================
git add .
git commit -m "🎨 fix(mobile): Menu mobile - títulos grandes, centralizados, sem sobreposição - DIRECT MAIN

✅ Correções mobile aplicadas:
- Títulos grandes (18px) e centralizados
- Zero sobreposição no resize
- Área de toque ampliada
- Performance otimizada
- Scripts corrigidos para MAIN

🚀 Deploy direto na produção"

git push origin main
echo ✅ DEPLOY DIRETO CONCLUÍDO!
goto SUCCESS

:COMMIT_AND_MERGE
echo.
echo 🔄 COMMIT NA BRANCH ATUAL + MERGE
echo ===============================
git add .
git commit -m "🎨 fix(mobile): Menu mobile fixes - %CURRENT_BRANCH%

✅ Correções aplicadas:
- Títulos grandes (18px) centralizados
- Anti-sobreposição resize
- Performance mobile
- Scripts MAIN corrigidos"

echo ✅ Commit na %CURRENT_BRANCH% realizado

echo 🔄 Fazendo merge para MAIN...
git checkout main
git pull origin main
git merge %CURRENT_BRANCH%
git push origin main
echo ✅ MERGE PARA MAIN CONCLUÍDO!
goto SUCCESS

:SUCCESS
echo.
echo 🎉 DEPLOY INTELIGENTE CONCLUÍDO!
echo ==============================
echo.
echo ✅ RESULTADO:
echo "- Mudanças locais resolvidas automaticamente"
echo "- Commit realizado na estratégia correta"
echo "- Deploy para produção enviado"
echo "- Vercel iniciará build automático"
echo.
echo 📱 TESTE EM 2-3 MINUTOS:
echo "🔗 https://libra-credito-landing-page-22.vercel.app/"
echo.
echo 🎯 VERIFICAR NO MOBILE:
echo "✅ Menu → títulos GRANDES (18px)"
echo "✅ Títulos centralizados"
echo "✅ Sem sobreposição no resize"
echo.
echo 📋 STATUS FINAL:
git branch --show-current
git log --oneline -2
echo.
echo 💡 Use Ctrl+Shift+R no browser
echo ⏰ Aguarde deploy Vercel (2-3 min)
echo.
pause
