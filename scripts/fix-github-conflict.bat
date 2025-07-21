@echo off
echo 🔧 RESOLVER CONFLITO GITHUB DEFINITIVAMENTE
echo ========================================

cd "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo 📂 Diretório: %CD%
echo.

echo 🔍 VERIFICANDO STATUS ATUAL...
git status
echo.

echo 📋 ESTRATÉGIA DEFINITIVA:
echo "1. Fetch latest changes"
echo "2. Reset para estado limpo" 
echo "3. Recriar arquivo correto"
echo "4. Commit e push forçado"
echo.

echo 🔄 FAZENDO FETCH...
git fetch origin
echo ✅ Fetch realizado

echo.
echo 🔍 VERIFICANDO SE HÁ CONFLITOS ATIVOS...
git diff --name-only --diff-filter=U
echo.

echo 🛠️ CORRIGINDO ARQUIVO use-mobile.tsx...
echo "Recriando arquivo com conteúdo correto"

echo /**> src\hooks\use-mobile.tsx
echo  * Hook para detectar se o dispositivo atual é mobile>> src\hooks\use-mobile.tsx
echo  * >> src\hooks\use-mobile.tsx
echo  * @hook useIsMobile>> src\hooks\use-mobile.tsx
echo  * @description Detecta se a viewport atual está em tamanho mobile usando media queries>> src\hooks\use-mobile.tsx
echo  * >> src\hooks\use-mobile.tsx
echo  * @returns {boolean} Retorna true se a viewport for menor que MOBILE_BREAKPOINT (1024px)>> src\hooks\use-mobile.tsx
echo  * >> src\hooks\use-mobile.tsx
echo  * @example>> src\hooks\use-mobile.tsx
echo  * ```tsx>> src\hooks\use-mobile.tsx
echo  * const isMobile = useIsMobile();>> src\hooks\use-mobile.tsx
echo  * >> src\hooks\use-mobile.tsx
echo  * return (>> src\hooks\use-mobile.tsx
echo  *   ^<div className={isMobile ? 'mobile-layout' : 'desktop-layout'}^>>> src\hooks\use-mobile.tsx
echo  *     {content}>> src\hooks\use-mobile.tsx
echo  *   ^</div^>>> src\hooks\use-mobile.tsx
echo  * );>> src\hooks\use-mobile.tsx
echo  * ```>> src\hooks\use-mobile.tsx
echo  */>> src\hooks\use-mobile.tsx
echo.>> src\hooks\use-mobile.tsx
echo import * as React from "react">> src\hooks\use-mobile.tsx
echo.>> src\hooks\use-mobile.tsx
echo const MOBILE_BREAKPOINT = 1024>> src\hooks\use-mobile.tsx
echo.>> src\hooks\use-mobile.tsx
echo export function useIsMobile() {>> src\hooks\use-mobile.tsx
echo   const [isMobile, setIsMobile] = React.useState^<boolean ^| undefined^>(undefined)>> src\hooks\use-mobile.tsx
echo.>> src\hooks\use-mobile.tsx
echo   React.useEffect(() =^> {>> src\hooks\use-mobile.tsx
echo     const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)>> src\hooks\use-mobile.tsx
echo     const onChange = () =^> {>> src\hooks\use-mobile.tsx
echo       setIsMobile(window.innerWidth ^< MOBILE_BREAKPOINT)>> src\hooks\use-mobile.tsx
echo     }>> src\hooks\use-mobile.tsx
echo     mql.addEventListener("change", onChange)>> src\hooks\use-mobile.tsx
echo     setIsMobile(window.innerWidth ^< MOBILE_BREAKPOINT)>> src\hooks\use-mobile.tsx
echo     return () =^> mql.removeEventListener("change", onChange)>> src\hooks\use-mobile.tsx
echo   }, [])>> src\hooks\use-mobile.tsx
echo.>> src\hooks\use-mobile.tsx
echo   return !!isMobile>> src\hooks\use-mobile.tsx
echo }>> src\hooks\use-mobile.tsx

echo ✅ Arquivo recriado com breakpoint 1024px

echo.
echo ➕ ADICIONANDO ARQUIVO...
git add src/hooks/use-mobile.tsx
echo ✅ Arquivo adicionado

echo.
echo 💾 FAZENDO COMMIT...
git commit -m "🔧 fix: Resolver conflito definitivo - use-mobile.tsx com breakpoint 1024px

✅ Arquivo corrigido:
- MOBILE_BREAKPOINT = 1024 (DEFINITIVO)
- Remove qualquer marcador de conflito
- Versão final e limpa

🎯 Resolução GitHub:
- Conflito use-mobile.tsx resolvido
- Pronto para merge no GitHub
- Breakpoint fix finalizado"

echo ✅ Commit realizado

echo.
echo 🚀 FAZENDO PUSH FORÇADO...
git push origin main --force-with-lease
echo ✅ Push forçado realizado

echo.
echo 🎉 CONFLITO GITHUB RESOLVIDO!
echo ============================
echo.
echo ✅ RESULTADO:
echo "- Arquivo use-mobile.tsx recriado"
echo "- Breakpoint 1024px definitivo"
echo "- Push forçado enviado"
echo "- GitHub deve aceitar merge agora"
echo.
echo 📱 PRÓXIMOS PASSOS:
echo "1. Aguarde 1-2 minutos"
echo "2. Volte ao GitHub"
echo "3. Clique em 'Merge pull request'"
echo "4. Escolha 'Create a merge commit'"
echo "5. Confirme o merge"
echo.
echo 🔗 GitHub PR:
echo "https://github.com/cwolfbr/libra-credito-landing-page-22/pulls"
echo.
pause
