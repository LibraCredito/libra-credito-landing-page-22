import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseApi, supabase } from '@/lib/supabase';
import { BlogService } from '@/services/blogService';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: unknown;
}

const SupabaseDiagnostics: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setIsRunning(true);
    setSyncStatus('Iniciando diagnósticos...');

    try {
      // 1. Teste de conexão básica
      setSyncStatus('Testando conexão básica...');
      try {
        const connected = await supabaseApi.testConnection();
        addResult({
          test: 'Conexão Básica',
          status: connected ? 'success' : 'error',
          message: connected ? 'Conexão estabelecida' : 'Falha na conexão'
        });
      } catch (error) {
        addResult({
          test: 'Conexão Básica',
          status: 'error',
          message: `Erro: ${error}`,
          details: error
        });
      }

      // 2. Teste da tabela blog_posts
      setSyncStatus('Verificando tabela blog_posts...');
      try {
        const posts = await supabaseApi.getAllBlogPosts();
        addResult({
          test: 'Tabela blog_posts',
          status: 'success',
          message: `✅ ${posts.length} posts encontrados`,
          details: posts
        });
      } catch (error) {
        addResult({
          test: 'Tabela blog_posts',
          status: 'error',
          message: `Erro ao acessar: ${error}`,
          details: error
        });
      }

      // 3. Teste do Storage (bucket blog-images)
      setSyncStatus('Verificando Supabase Storage...');
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (error) throw error;
        
        const blogImagesBucket = buckets?.find(b => b.name === 'blog-images');
        
        if (blogImagesBucket) {
          addResult({
            test: 'Storage Bucket',
            status: 'success',
            message: '✅ Bucket blog-images encontrado',
            details: blogImagesBucket
          });

          // Testar listagem de arquivos
          const { data: files, error: listError } = await supabase.storage
            .from('blog-images')
            .list('', { limit: 5 });

          if (listError) {
            addResult({
              test: 'Listagem Storage',
              status: 'warning',
              message: `Aviso: ${listError.message}`,
              details: listError
            });
          } else {
            addResult({
              test: 'Listagem Storage',
              status: 'success',
              message: `✅ ${files?.length || 0} arquivos encontrados`,
              details: files
            });
          }
        } else {
          addResult({
            test: 'Storage Bucket',
            status: 'error',
            message: '❌ Bucket blog-images não encontrado',
            details: buckets
          });
        }
      } catch (error) {
        addResult({
          test: 'Storage Bucket',
          status: 'error',
          message: `Erro no storage: ${error}`,
          details: error
        });
      }

      // 4. Teste de criação de post
      setSyncStatus('Testando criação de post...');
      try {
        const testPost = {
          title: 'Teste de Diagnóstico',
          description: 'Post de teste para verificar funcionamento',
          category: 'home-equity' as const,
          content: 'Conteúdo de teste para diagnóstico do sistema.',
          imageUrl: 'https://placehold.co/600x400?text=Blog+Image',
          slug: `teste-diagnostico-${Date.now()}`,
          readTime: 1,
          published: false,
          featuredPost: false
        };

        const created = await supabaseApi.createBlogPost(testPost);
        
        // Deletar o post de teste
        await supabaseApi.deleteBlogPost(created.id!);
        
        addResult({
          test: 'CRUD Posts',
          status: 'success',
          message: '✅ Criação e exclusão funcionando',
          details: created
        });
      } catch (error) {
        addResult({
          test: 'CRUD Posts',
          status: 'error',
          message: `Erro no CRUD: ${error}`,
          details: error
        });
      }

      setSyncStatus('Diagnósticos concluídos!');
    } catch (error) {
      addResult({
        test: 'Diagnóstico Geral',
        status: 'error',
        message: `Erro geral: ${error}`,
        details: error
      });
    } finally {
      setIsRunning(false);
    }
  };

  const syncLocalToSupabase = async () => {
    setIsRunning(true);
    setSyncStatus('Sincronizando dados locais para Supabase...');

    try {
      // Obter posts do localStorage
      const localPosts = JSON.parse(localStorage.getItem('libra_blog_posts') || '[]');
      
      if (localPosts.length === 0) {
        setSyncStatus('Nenhum post local encontrado para sincronizar');
        return;
      }

      let synced = 0;
      let errors = 0;

      for (const post of localPosts) {
        try {
          setSyncStatus(`Sincronizando: ${post.title}`);
          
          // Verificar se já existe no Supabase
          const existing = await supabaseApi.getBlogPostById(post.id).catch(() => null);
          
          if (!existing) {
            // Criar no Supabase
            const supabaseData = BlogService.convertBlogPostToSupabase(post);
            await supabaseApi.createBlogPost(supabaseData);
            synced++;
          }
        } catch (error) {
          console.error(`Erro ao sincronizar post ${post.title}:`, error);
          errors++;
        }
      }

      setSyncStatus(`Sincronização concluída: ${synced} posts sincronizados, ${errors} erros`);
      
    } catch (error) {
      setSyncStatus(`Erro na sincronização: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const createStorageBucket = async () => {
    setIsRunning(true);
    setSyncStatus('Tentando criar bucket blog-images...');

    try {
      const { data, error } = await supabase.storage.createBucket('blog-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        setSyncStatus(`Erro ao criar bucket: ${error.message}`);
      } else {
        setSyncStatus('✅ Bucket blog-images criado com sucesso!');
        addResult({
          test: 'Criação de Bucket',
          status: 'success',
          message: 'Bucket criado com sucesso',
          details: data
        });
      }
    } catch (error) {
      setSyncStatus(`Erro: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🔧 Diagnósticos Supabase</CardTitle>
        <p className="text-sm text-gray-600">
          Verificar e corrigir problemas de conexão com o Supabase
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700"
          >
            🔍 Executar Diagnósticos
          </Button>
          
          <Button 
            onClick={syncLocalToSupabase} 
            disabled={isRunning}
            variant="outline"
          >
            🔄 Sync Local → Supabase
          </Button>
          
          <Button 
            onClick={createStorageBucket} 
            disabled={isRunning}
            variant="outline"
          >
            📁 Criar Bucket Storage
          </Button>
        </div>

        {syncStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">{syncStatus}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Resultados dos Testes:</h4>
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md border ${
                  result.status === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : result.status === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-medium ${
                      result.status === 'success' 
                        ? 'text-green-700' 
                        : result.status === 'warning'
                        ? 'text-yellow-700'
                        : 'text-red-700'
                    }`}>
                      {result.test}
                    </p>
                    <p className={`text-sm ${
                      result.status === 'success' 
                        ? 'text-green-600' 
                        : result.status === 'warning'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {result.message}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.status === 'success' 
                      ? 'bg-green-100 text-green-700' 
                      : result.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer opacity-70">
                      Ver detalhes
                    </summary>
                    <pre className="text-xs mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-1">ℹ️ O que este diagnóstico verifica:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Conexão básica com Supabase</li>
            <li>Acesso à tabela blog_posts</li>
            <li>Configuração do Storage bucket</li>
            <li>Permissões de CRUD</li>
            <li>Sincronização de dados locais</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseDiagnostics;