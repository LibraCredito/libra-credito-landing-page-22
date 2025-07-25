import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wprkpdqnmibxphiofoqk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcmtwZHFubWlieHBoaW9mb3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NzM4NjAsImV4cCI6MjA2ODI0OTg2MH0.OABg1mnBBFxceEHRIdDrGbFo4m0yau6bN91HxnMkazw'

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBlogImages() {
  console.log('🔍 Testando conectividade com Supabase...\n');
  
  try {
    // 1. Testar conexão básica
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Erro ao conectar com Supabase:', bucketError);
      return;
    }
    
    console.log('✅ Conexão com Supabase OK');
    console.log('📦 Buckets encontrados:', buckets.map(b => b.name));
    
    // 2. Verificar se blog-images existe
    const blogBucket = buckets.find(b => b.name === 'blog-images');
    
    if (!blogBucket) {
      console.log('\n❌ Bucket blog-images NÃO encontrado!');
      console.log('🔧 Tentando criar o bucket...');
      
      const { data: createData, error: createError } = await supabase.storage.createBucket('blog-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      });
      
      if (createError) {
        console.error('❌ Erro ao criar bucket:', createError);
        return;
      }
      
      console.log('✅ Bucket blog-images criado com sucesso!');
    } else {
      console.log('\n✅ Bucket blog-images encontrado');
      console.log('📊 Público:', blogBucket.public);
    }
    
    // 3. Testar listagem de imagens
    console.log('\n📋 Testando listagem de imagens...');
    const { data: files, error: listError } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 10 });
    
    if (listError) {
      console.error('❌ Erro ao listar arquivos:', listError);
      return;
    }
    
    console.log(`✅ ${files.length} arquivos encontrados no bucket`);
    if (files.length > 0) {
      console.log('📁 Primeiros arquivos:');
      files.slice(0, 5).forEach(file => {
        console.log(`  - ${file.name} (${(file.metadata?.size / 1024).toFixed(1)}KB)`);
      });
    }
    
    // 4. Testar URLs públicas se há arquivos
    if (files.length > 0) {
      const firstFile = files[0];
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(firstFile.name);
      
      console.log(`\n🔗 URL da primeira imagem: ${urlData.publicUrl}`);
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

testBlogImages();