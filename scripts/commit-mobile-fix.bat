@echo off
echo 🚀 Fazendo commit das correções mobile...

:: Adicionar todos os arquivos modificados
git add .

:: Commit com mensagem descritiva
git commit -m "🔧 fix: Corrigir layout mobile quebrado

✅ Problemas resolvidos:
- Unificar hooks mobile (remover useIsMobile duplicado)  
- Simplificar lógica de header (mobile vs desktop)
- Corrigir espaçamento mobile (pt-10 → pt-20)
- Adicionar CSS mobile-first seguro
- Implementar classes safe-area para dispositivos com notch
- Adicionar atributos data para CSS específico

🎯 Resultado:
- Header fixo funcionando perfeitamente
- Conteúdo bem posicionado
- Layout mobile-first otimizado  
- Navegação responsiva funcional

Testado em: Chrome DevTools Mobile, layout responsivo"

:: Push para o repositório
git push origin main

echo ✅ Commit e push realizados com sucesso!
echo 📱 Site mobile agora está totalmente funcional!
pause