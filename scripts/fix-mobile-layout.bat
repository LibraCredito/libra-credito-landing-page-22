@echo off
echo 📱 CORREÇÃO MOBILE - LAYOUT RESPONSIVO
echo ====================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo ✅ CORREÇÕES APLICADAS PARA MOBILE!
echo.
echo 📱 AJUSTES PARA DISPOSITIVOS MÓVEIS:
echo ✅ Altura do Hero: 70vh (era 50vh - muito baixo)
echo ✅ Textos maiores: text-lg no mobile (era text-base)
echo ✅ Ícones normais: w-5 h-5 no mobile (era w-4 h-4)
echo ✅ Espaçamentos: gap-3 no mobile (era gap-2)
echo ✅ Faixas de onda: 70px no mobile (eram 60px)
echo ✅ "Saiba mais": text-sm no mobile (era text-xs)
echo.
echo 🖥️ DESKTOP MANTIDO OTIMIZADO:
echo ✅ Primeira dobra: calc(100vh-280px)
echo ✅ Textos compactos: apenas no desktop (lg:)
echo ✅ Ambas as faixas visíveis na primeira dobra
echo.
echo 📊 BREAKPOINTS OTIMIZADOS:
echo 📱 Mobile (0-768px): Layout generoso e legível
echo 💻 Tablet (768-1024px): Transição suave
echo 🖥️ Desktop (1024px+): Primeira dobra otimizada
echo.

echo 🔨 Testando build...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD FUNCIONANDO!
    echo.
    echo 📁 Fazendo commit...
    git add .
    git commit -m "fix: improve mobile layout while maintaining desktop first fold

📱 Mobile optimizations:
- Hero height: min-h-[70vh] (was 50vh - too cramped)
- Typography: text-lg for mobile text (was text-base)
- Icons: w-5 h-5 on mobile (was w-4 h-4 - too small)
- Spacing: gap-3 for mobile buttons (was gap-2)
- Wave heights: 70px mobile (was 60px)
- 'Saiba mais': text-sm on mobile (was text-xs)

🖥️ Desktop preserved:
- First fold optimization maintained: calc(100vh-280px)
- Both wave separators + Hero content visible without scroll
- Compact layout only applied on lg+ breakpoints

📊 Responsive strategy: Generous mobile → Optimized desktop"
    
    echo.
    echo 🚀 Fazendo push...
    git push origin v23
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo 🎉 MOBILE CORRIGIDO E DESKTOP MANTIDO!
        echo.
        echo 🌐 Site atualizado em:
        echo https://librav1.vercel.app
        echo.
        echo ✅ RESULTADO POR DISPOSITIVO:
        echo 📱 Mobile: Layout bonito e legível
        echo 💻 Tablet: Transição suave
        echo 🖥️ Desktop: Primeira dobra perfeita
        echo 🌊 Ondas: Responsivas em todos os tamanhos
    ) else (
        echo ❌ Erro no push
    )
) else (
    echo ❌ Erro no build
)

echo.
pause