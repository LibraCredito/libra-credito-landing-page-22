const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wprkpdqnmibxphiofoqk.supabase.co';
const supabaseAnonKey = 'sb_publishable_xjn_ruSWUfyiqoMIrQfcOw_-YVtj5lr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorage() {
  console.log('🔄 Testando Storage do Supabase...');
  
  try {
    // 1. Listar buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.log('❌ Erro ao listar buckets:', listError.message);
      return;
    }
    
    console.log('📦 Buckets encontrados:');
    buckets.forEach(bucket => {
      console.log('  -', bucket.name, '(público:', bucket.public + ')');
    });
    
    // 2. Verificar bucket blog-images
    const blogImagesBucket = buckets.find(b => b.name === 'blog-images');
    if (!blogImagesBucket) {
      console.log('❌ Bucket blog-images não encontrado!');
      return;
    }
    
    console.log('✅ Bucket blog-images existe e é público:', blogImagesBucket.public);
    
    // 3. Testar listagem de arquivos
    const { data: files, error: filesError } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 10 });
    
    if (filesError) {
      console.log('❌ Erro ao listar arquivos:', filesError.message);
      console.log('Detalhes:', filesError);
    } else {
      console.log('📁 Arquivos no bucket:', files.length);
      files.forEach(file => console.log('  -', file.name));
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

testStorage();