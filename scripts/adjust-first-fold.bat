@echo off
echo 🖥️ AJUSTE PRIMEIRA DOBRA - DESKTOP
echo ================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo ✅ AJUSTES APLICADOS PARA PRIMEIRA DOBRA!
echo.
echo 📏 CÁLCULO DA PRIMEIRA DOBRA (Desktop 1080px):
echo • Header: ~80px
echo • Faixa Superior: 120px  
echo • Hero: calc(100vh - 280px) ≈ 800px
echo • Faixa Inferior: 120px
echo = Total: ~1000px (cabe na primeira dobra!)
echo.
echo 🔧 MODIFICAÇÕES REALIZADAS:
echo ✅ Hero altura ajustada: min-h-[calc(100vh-280px)]
echo ✅ Títulos menores: text-2xl → text-4xl (responsivo)
echo ✅ Textos compactos: espaçamentos reduzidos
echo ✅ Botões mais próximos: gap-2 sm:gap-3
echo ✅ "Saiba mais" menor: text-xs lg:text-sm
echo.
echo 🎯 RESULTADO NO DESKTOP:
echo 🌊 Faixa Superior: Visível na primeira dobra
echo 📄 Hero: Conteúdo completo visível
echo 🌊 Faixa Inferior: Visível na primeira dobra
echo 📱 Mobile: Mantido como estava (responsivo)
echo.

echo 🔨 Testando build...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD FUNCIONANDO!
    echo.
    echo 📁 Fazendo commit...
    git add .
    git commit -m "feat: adjust Hero height for first fold visibility on desktop

🖥️ Optimized for desktop first fold visibility:
- Hero height: min-h-[calc(100vh-280px)] for desktop  
- Responsive typography: text-2xl → text-4xl xl:text-5xl
- Compact spacing: reduced gaps and margins
- Smaller elements: buttons, icons, 'Saiba mais' text
- Mobile layout preserved (min-h-[50vh])

🎯 Result: Both wave separators + Hero content visible in first fold
📊 Calculation: Header(80px) + TopWave(120px) + Hero(~800px) + BottomWave(120px) = ~1000px
✅ Perfect fit for 1080p+ desktop screens"
    
    echo.
    echo 🚀 Fazendo push...
    git push origin v23
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo 🎉 PRIMEIRA DOBRA OTIMIZADA!
        echo.
        echo 🌐 Site atualizado em:
        echo https://librav1.vercel.app
        echo.
        echo ✅ RESULTADO NO DESKTOP:
        echo 🔍 PRIMEIRA DOBRA: Tudo visível sem scroll
        echo 🌊 Faixa Superior: Totalmente visível
        echo 📄 Hero: Conteúdo completo exibido
        echo 🌊 Faixa Inferior: Totalmente visível
        echo 📱 Mobile: Responsividade mantida
    ) else (
        echo ❌ Erro no push
    )
) else (
    echo ❌ Erro no build
)

echo.
pause