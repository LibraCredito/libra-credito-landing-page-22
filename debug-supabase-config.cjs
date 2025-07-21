const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wprkpdqnmibxphiofoqk.supabase.co';
const supabaseAnonKey = 'sb_publishable_xjn_ruSWUfyiqoMIrQfcOw_-YVtj5lr';

console.log('🔧 Debug da configuração Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 30) + '...');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugConfig() {
  try {
    // 1. Testar conexão básica
    console.log('\n1. Testando conexão básica...');
    const { data: testData, error: testError } = await supabase
      .from('simulacoes')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ Erro na conexão básica:', testError.message);
      return;
    }
    
    console.log('✅ Conexão básica funcionando');
    
    // 2. Testar storage sem especificar bucket
    console.log('\n2. Testando acesso ao storage...');
    const { data: storageData, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.log('❌ Erro ao acessar storage:', storageError.message);
      console.log('Código:', storageError.status);
      console.log('Detalhes:', storageError);
      return;
    }
    
    console.log('✅ Storage acessível');
    console.log('Buckets encontrados:', storageData.length);
    
    if (storageData.length === 0) {
      console.log('⚠️ Nenhum bucket encontrado - pode ser problema de permissões');
    } else {
      storageData.forEach(bucket => {
        console.log(`  - ${bucket.name} (público: ${bucket.public}, criado: ${bucket.created_at})`);
      });
    }
    
    // 3. Testar acesso direto ao bucket (mesmo que não listado)
    console.log('\n3. Testando acesso direto ao bucket blog-images...');
    const { data: filesData, error: filesError } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 1 });
    
    if (filesError) {
      console.log('❌ Erro ao acessar bucket diretamente:', filesError.message);
      console.log('Código:', filesError.status);
      console.log('Detalhes:', filesError);
    } else {
      console.log('✅ Bucket blog-images acessível diretamente!');
      console.log('Arquivos:', filesData.length);
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
    console.log('Stack:', error.stack);
  }
}

debugConfig();