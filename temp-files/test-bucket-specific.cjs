const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wprkpdqnmibxphiofoqk.supabase.co';
const supabaseAnonKey = 'sb_publishable_xjn_ruSWUfyiqoMIrQfcOw_-YVtj5lr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testBucketAccess() {
  console.log('🔄 Testando acesso específico ao bucket...');
  
  try {
    // 1. Tentar acessar o bucket diretamente
    console.log('\n1. Tentando listar arquivos no bucket blog-images...');
    const { data: files, error: filesError } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 10 });
    
    if (filesError) {
      console.log('❌ Erro ao acessar bucket:', filesError.message);
      console.log('Código:', filesError.status);
      console.log('Detalhes completos:', filesError);
    } else {
      console.log('✅ Bucket acessível! Arquivos encontrados:', files.length);
      files.forEach(file => {
        console.log('  -', file.name, '(tamanho:', file.metadata?.size || 'N/A', ')');
      });
    }
    
    // 2. Tentar upload de teste
    console.log('\n2. Tentando upload de teste...');
    const testFile = new Blob(['test content'], { type: 'text/plain' });
    const testFileName = 'test-' + Date.now() + '.txt';
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(testFileName, testFile);
    
    if (uploadError) {
      console.log('❌ Erro no upload de teste:', uploadError.message);
      console.log('Código:', uploadError.status);
      console.log('Detalhes:', uploadError);
    } else {
      console.log('✅ Upload de teste bem-sucedido!');
      console.log('Caminho:', uploadData.path);
      
      // Tentar obter URL pública
      const { data: publicUrl } = supabase.storage
        .from('blog-images')
        .getPublicUrl(testFileName);
      
      console.log('📂 URL pública:', publicUrl.publicUrl);
      
      // Limpar arquivo de teste
      await supabase.storage
        .from('blog-images')
        .remove([testFileName]);
      console.log('🗑️ Arquivo de teste removido');
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    console.log('Stack:', error.stack);
  }
}

testBucketAccess();