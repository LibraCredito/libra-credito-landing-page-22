const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wprkpdqnmibxphiofoqk.supabase.co';
const supabaseAnonKey = 'sb_publishable_xjn_ruSWUfyiqoMIrQfcOw_-YVtj5lr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDirectUpload() {
  console.log('🔄 Teste de upload direto...');
  
  try {
    // Criar arquivo de teste mais realista
    const testContent = 'fake-image-content-for-testing';
    const testFile = new Blob([testContent], { type: 'image/jpeg' });
    
    // Usar mesma lógica do código real
    const fileExt = 'jpg';
    const finalFileName = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${finalFileName}`;
    
    console.log('📁 Fazendo upload para:', filePath);
    
    // Upload direto (exatamente como o código real)
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.log('❌ Erro no upload direto:');
      console.log('  Mensagem:', error.message);
      console.log('  Status:', error.status);
      console.log('  Detalhes:', error);
      
      // Tentar diagnóstico mais específico
      if (error.message.includes('row-level security')) {
        console.log('💡 Problema: Políticas de RLS não configuradas corretamente');
      } else if (error.message.includes('bucket')) {
        console.log('💡 Problema: Bucket não encontrado ou inacessível');
      } else if (error.message.includes('permission')) {
        console.log('💡 Problema: Sem permissão para upload');
      }
      
      return;
    }
    
    console.log('✅ Upload direto realizado com sucesso!');
    console.log('📂 Path:', data.path);
    
    // Obter URL pública
    const { data: publicURL } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);
    
    console.log('🔗 URL pública:', publicURL.publicUrl);
    
    // Verificar se consegue listar o arquivo
    console.log('\n📋 Verificando se arquivo aparece na listagem...');
    const { data: files, error: listError } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 10 });
    
    if (listError) {
      console.log('❌ Erro ao listar arquivos:', listError.message);
    } else {
      console.log('📁 Arquivos no bucket:', files.length);
      const uploadedFile = files.find(f => f.name === finalFileName);
      if (uploadedFile) {
        console.log('✅ Arquivo encontrado na listagem!');
      } else {
        console.log('⚠️ Arquivo não aparece na listagem (pode ser normal)');
      }
    }
    
    // Tentar acessar URL
    console.log('\n🌐 Testando acesso à URL...');
    try {
      const response = await fetch(publicURL.publicUrl);
      console.log('📡 Status HTTP:', response.status);
      
      if (response.ok) {
        console.log('✅ URL acessível!');
        console.log('📦 Tamanho:', response.headers.get('content-length'), 'bytes');
      } else {
        console.log('❌ URL não acessível');
      }
    } catch (fetchError) {
      console.log('❌ Erro ao acessar URL:', fetchError.message);
    }
    
    // Limpar
    console.log('\n🗑️ Limpando arquivo de teste...');
    const { error: deleteError } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);
    
    if (deleteError) {
      console.log('⚠️ Erro ao deletar:', deleteError.message);
    } else {
      console.log('✅ Arquivo removido');
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    console.log('Stack:', error.stack);
  }
}

testDirectUpload();