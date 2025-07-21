@echo off
echo DEPLOY BREAKPOINT FIX - MENU LATERAL ATIVA ANTES
echo ==============================================

cd "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo Diretorio: %CD%
echo.

echo MUDANCA APLICADA:
echo - Breakpoint mobile: 768px → 1024px
echo - Menu lateral ativa ANTES das quebras
echo - Logo e botoes nunca mais sobrepostos
echo.

echo STATUS ATUAL:
git status --short
echo.

echo ADICIONANDO ARQUIVOS...
git add .

echo FAZENDO COMMIT...
git commit -m "🔧 fix(responsive): Aumentar breakpoint mobile para 1024px - prevenir quebras layout

✅ Problema resolvido:
- Logo cortado em telas intermediarias
- Parceiros sobrepondo Portal de Clientes  
- Quebras entre 768px-1024px

🎯 Solucao:
- Breakpoint: 768px → 1024px
- Menu lateral ativa ANTES das quebras
- Layout sempre funcional
- UX fluida em qualquer resolucao

📱 Resultado:
- Desktop: ≥1024px (completo)
- Mobile: <1024px (menu lateral)
- Zero sobreposicoes
- Transicao suave

🧪 Testado em:
- Divisao de tela
- Redimensionamento
- Telas intermediarias 800px-1023px"

echo FAZENDO PUSH...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! BREAKPOINT CORRIGIDO!
    echo ============================
    echo.
    echo - Breakpoint aumentado para 1024px
    echo - Menu lateral ativa ANTES das quebras
    echo - Deploy enviado para Vercel
    echo.
    echo TESTE EM 2-3 MINUTOS:
    echo https://libra-credito-landing-page-22.vercel.app/
    echo.
    echo VERIFICAR:
    echo - Redimensione a janela
    echo - Menu lateral deve aparecer em 1024px
    echo - Sem quebras de layout
    echo - Logo sempre visivel
    echo - Botoes nunca sobrepostos
    echo.
) else (
    echo.
    echo ERRO NO PUSH
    git status
)

echo STATUS FINAL:
git log --oneline -2
echo.
pause
