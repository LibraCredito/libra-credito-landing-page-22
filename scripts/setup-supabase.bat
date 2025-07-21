@echo off
echo ============================================
echo  LIBRA CREDITO - SETUP SUPABASE INTEGRATION
echo ============================================
echo.

echo [1/5] Verificando Node.js e NPM...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js nao encontrado! Instale Node.js primeiro.
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: NPM nao encontrado!
    pause
    exit /b 1
)
echo ✅ NPM encontrado
echo.

echo [2/5] Instalando dependencias Supabase...
echo Instalando @supabase/supabase-js...
npm install @supabase/supabase-js@^2.39.0
if errorlevel 1 (
    echo ❌ ERRO: Falha ao instalar @supabase/supabase-js
    pause
    exit /b 1
)

echo Instalando uuid...
npm install uuid@^9.0.1
if errorlevel 1 (
    echo ❌ ERRO: Falha ao instalar uuid
    pause
    exit /b 1
)

echo Instalando tipos TypeScript...
npm install --save-dev @types/uuid@^9.0.7
if errorlevel 1 (
    echo ❌ ERRO: Falha ao instalar @types/uuid
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas com sucesso!
echo.

echo [3/5] Verificando instalacao...
npm list @supabase/supabase-js uuid @types/uuid
echo.

echo [4/5] Testando build do projeto...
echo Executando build de teste...
npm run build >nul 2>&1
if errorlevel 1 (
    echo ⚠️  AVISO: Build falhou - pode haver erros de TypeScript
    echo Execute 'npm run build' manualmente para verificar
) else (
    echo ✅ Build executado com sucesso!
)
echo.

echo [5/5] Setup finalizado!
echo.
echo ============================================
echo  PROXIMOS PASSOS:
echo ============================================
echo.
echo 1. ✅ Dependencias instaladas
echo 2. 📋 Execute o SQL no Supabase Dashboard:
echo    - Acesse https://app.supabase.com
echo    - Va em SQL Editor  
echo    - Execute o arquivo create_supabase_tables.sql
echo.
echo 3. 🧪 Teste a implementacao:
echo    - npm run dev
echo    - Acesse /simulacao
echo    - Realize uma simulacao
echo    - Acesse /admin para ver os dados
echo.
echo 4. 📖 Leia o README completo:
echo    - SUPABASE_INTEGRATION_README.md
echo.
echo ============================================
echo  URLS IMPORTANTES:
echo ============================================
echo.
echo 🏠 Site: http://localhost:5173
echo 📊 Admin: http://localhost:5173/admin  
echo 🧮 Simulacao: http://localhost:5173/simulacao
echo 💾 Supabase: https://app.supabase.com
echo.
echo ✅ Setup concluido com sucesso!
echo.
pause
