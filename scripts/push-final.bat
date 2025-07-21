@echo off
echo PUSH PARA PRODUCAO - FINALIZANDO DEPLOY
echo ====================================

cd "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo Diretorio: %CD%
echo.

echo STATUS ATUAL:
git branch --show-current
git status --short
echo.

echo FAZENDO PUSH PARA PRODUCAO...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! DEPLOY COMPLETO!
    echo =========================
    echo.
    echo - Commit realizado na MAIN
    echo - Push enviado para GitHub
    echo - Deploy Vercel iniciado
    echo.
    echo TESTE EM 2-3 MINUTOS:
    echo https://libra-credito-landing-page-22.vercel.app/
    echo.
    echo VERIFICAR:
    echo - Menu hamburguer
    echo - Titulos GRANDES (18px)
    echo - Titulos centralizados
    echo - Sem sobreposicao no resize
    echo.
) else (
    echo.
    echo ERRO NO PUSH - Verificando...
    git status
    git log --oneline -2
)

echo.
echo ATUALIZANDO TAG V23...
git tag -d v23 2>nul
git tag v23
git push origin v23 --force

echo.
echo STATUS FINAL:
git log --oneline -2
echo.
pause
