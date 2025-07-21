const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wprkpdqnmibxphiofoqk.supabase.co';
const supabaseAnonKey = 'sb_publishable_xjn_ruSWUfyiqoMIrQfcOw_-YVtj5lr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUploadFlow() {
  console.log('🔄 Testando fluxo completo de upload...');
  
  try {
    // 1. Verificar bucket
    console.log('\n1. Verificando bucket...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.log('❌ Erro ao listar buckets:', listError);
      return;
    }
    
    const blogBucket = buckets.find(b => b.name === 'blog-images');
    if (!blogBucket) {
      console.log('❌ Bucket blog-images não encontrado');
      return;
    }
    
    console.log('✅ Bucket blog-images encontrado:', blogBucket.public ? 'público' : 'privado');
    
    // 2. Simular upload igual ao código real
    console.log('\n2. Simulando upload real...');
    
    // Criar arquivo de teste igual ao que o código faz
    const testContent = 'Test image content';
    const testFile = new Blob([testContent], { type: 'image/jpeg' });
    
    // Replicar lógica do código real
    const fileExt = 'jpg';
    const finalFileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${finalFileName}`;
    
    console.log('📁 Caminho do arquivo:', filePath);
    
    // Upload com mesmas configurações do código
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, testFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.log('❌ Erro no upload:', error.message);
      console.log('Código:', error.status);
      console.log('Detalhes completos:', error);
      return;
    }
    
    console.log('✅ Upload realizado com sucesso!');
    console.log('Path:', data.path);
    
    // 3. Obter URL pública
    console.log('\n3. Obtendo URL pública...');
    const { data: publicURL } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);
    
    console.log('🔗 URL pública:', publicURL.publicUrl);
    
    // 4. Testar se URL funciona
    console.log('\n4. Testando acesso à URL...');
    try {
      const response = await fetch(publicURL.publicUrl);
      console.log('📡 Status da URL:', response.status, response.statusText);
      
      if (response.ok) {
        console.log('✅ URL acessível!');
      } else {
        console.log('❌ URL não acessível');
      }
    } catch (fetchError) {
      console.log('❌ Erro ao acessar URL:', fetchError.message);
    }
    
    // 5. Limpar arquivo de teste
    console.log('\n5. Limpando arquivo de teste...');
    const { error: deleteError } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);
    
    if (deleteError) {
      console.log('⚠️ Erro ao deletar arquivo de teste:', deleteError.message);
    } else {
      console.log('🗑️ Arquivo de teste removido');
    }
    
  } catch (error) {
    console.log('❌ Erro geral no teste:', error.message);
    console.log('Stack:', error.stack);
  }
}

testUploadFlow();