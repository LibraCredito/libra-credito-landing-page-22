const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wprkpdqnmibxphiofoqk.supabase.co';
const supabaseAnonKey = 'sb_publishable_xjn_ruSWUfyiqoMIrQfcOw_-YVtj5lr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugStorage() {
  console.log('🔄 Debug completo do Storage...');
  
  try {
    // 1. Listar buckets
    console.log('\n1. Listando buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.log('❌ Erro ao listar buckets:', listError.message);
      console.log('Detalhes do erro:', listError);
      return;
    }
    
    console.log('📦 Buckets encontrados:', buckets.length);
    buckets.forEach((bucket, index) => {
      console.log(`  ${index + 1}. ${bucket.name} (público: ${bucket.public}, criado: ${bucket.created_at})`);
    });
    
    // 2. Tentar criar bucket programaticamente
    console.log('\n2. Tentando criar bucket blog-images...');
    const { data: createData, error: createError } = await supabase.storage.createBucket('blog-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (createError) {
      console.log('❌ Erro ao criar bucket:', createError.message);
      console.log('Código do erro:', createError.status);
      console.log('Detalhes:', createError);
      
      // Se erro for "already exists", não é um problema
      if (createError.message.includes('already exists') || createError.message.includes('Duplicate')) {
        console.log('✅ Bucket já existe (normal)');
      }
    } else {
      console.log('✅ Bucket criado com sucesso:', createData);
    }
    
    // 3. Verificar novamente após tentativa de criação
    console.log('\n3. Verificando buckets após criação...');
    const { data: bucketsAfter, error: listAfterError } = await supabase.storage.listBuckets();
    
    if (listAfterError) {
      console.log('❌ Erro ao listar buckets após criação:', listAfterError.message);
    } else {
      console.log('📦 Buckets após criação:', bucketsAfter.length);
      bucketsAfter.forEach((bucket, index) => {
        console.log(`  ${index + 1}. ${bucket.name} (público: ${bucket.public})`);
      });
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    console.log('Stack:', error.stack);
  }
}

debugStorage();