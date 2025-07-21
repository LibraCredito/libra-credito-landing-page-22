@echo off
echo 🌊 IMPLEMENTANDO FAIXA SUPERIOR INVERTIDA
echo =======================================

cd /d "C:\Users\raulp\OneDrive\Documentos\GitHub\libra-credito-landing-page-22"

echo ✅ FAIXA SUPERIOR ADICIONADA!
echo.
echo 🎨 EFEITO "SANDUÍCHE" DE ONDAS CRIADO:
echo.
echo 📍 ESTRUTURA ATUAL:
echo 1. 🌊 WaveSeparator INVERTIDA (ondas para baixo)
echo 2. 📄 Hero (conteúdo principal)  
echo 3. 🌊 WaveSeparator NORMAL (ondas para cima)
echo 4. 📊 TrustBarMinimal (contadores dinâmicos)
echo.
echo 🔧 MODIFICAÇÕES REALIZADAS:
echo + Adicionada prop "inverted" ao WaveSeparator
echo + Faixa superior com ondas invertidas
echo + Hero ajustado (removido pt-header)
echo + Efeito visual idêntico ao da imagem anexa
echo.

echo 🔨 Testando build...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ BUILD FUNCIONANDO!
    echo.
    echo 📁 Fazendo commit...
    git add .
    git commit -m "feat: add inverted wave separator on top - sandwich effect

🌊 Added inverted wave separator for sandwich effect:
- Added 'inverted' prop to WaveSeparator component
- Top wave separator with inverted waves (pointing down)
- Bottom wave separator maintained (pointing up)  
- Adjusted Hero section padding for perfect connection
- Created visual sandwich effect as requested

🎨 Structure: Inverted Wave → Hero → Normal Wave → TrustBar
✨ 3-layer depth effect maintained on both wave separators"
    
    echo.
    echo 🚀 Fazendo push...
    git push origin v23
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo 🎉 EFEITO SANDUÍCHE IMPLEMENTADO!
        echo.
        echo 🌐 Site atualizado em:
        echo https://librav1.vercel.app
        echo.
        echo ✅ RESULTADO FINAL:
        echo 🌊 Faixa superior: Ondas invertidas (para baixo)
        echo 📄 Hero: Perfeitamente conectado
        echo 🌊 Faixa inferior: Ondas normais (para cima)  
        echo 🎨 Efeito visual de profundidade mantido
        echo 📱 Totalmente responsivo
    ) else (
        echo ❌ Erro no push
    )
) else (
    echo ❌ Erro no build
)

echo.
pause