/**
 * Lazy-loaded Supabase Client
 * 
 * @description Implementação de carregamento dinâmico do cliente Supabase
 * para reduzir o bundle inicial e melhorar performance de LCP
 * 
 * OTIMIZAÇÃO: Cliente Supabase carregado apenas quando necessário
 * Reduz ~116KB do bundle inicial
 */

import type { Database, SimulacaoData, ParceiroData, UserJourneyData, BlogPostData } from './supabase';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_OPTIONS } from './supabaseConfig';

// Cache do cliente para evitar múltiplas inicializações
let supabaseClient: any = null;
let supabaseApi: any = null;
let loadingPromise: Promise<any> | null = null;

/**
 * Carrega o cliente Supabase dinamicamente
 */
async function loadSupabaseClient() {
  // Se já está em cache, retorna imediatamente
  if (supabaseClient && supabaseApi) {
    return { supabase: supabaseClient, supabaseApi };
  }
  
  // Se já está carregando, retorna a mesma promise
  if (loadingPromise) {
    return loadingPromise;
  }
  
  // Inicia o carregamento
  loadingPromise = import('@supabase/supabase-js')
    .then(async ({ createClient }) => {
      // Criar cliente
      const client = createClient<Database>(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        SUPABASE_OPTIONS
      );

      // Debug apenas em development
      if (typeof window !== 'undefined' && import.meta.env.DEV) {
        console.log('Supabase client loaded lazily');
        console.log('Supabase URL:', SUPABASE_URL);
        console.log('Supabase Key:', SUPABASE_ANON_KEY?.substring(0, 20) + '...');
      }

      // Cache do cliente
      supabaseClient = client;

      // Criar API helper
      const api = {
        // Teste de conexão
        async testConnection() {
          try {
            const { data, error } = await client
              .from('parceiros')
              .select('*')
              .limit(1);
            
            if (error) {
              if (process.env.NODE_ENV === 'development') {
                console.warn('Supabase connection issue:', error.message);
              }
              return false;
            }
            
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ Conexão Supabase OK (lazy loaded)');
            }
            return true;
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Supabase connection failed:', error);
            }
            return false;
          }
        },

        // Simulações
        async createSimulacao(data: Database['public']['Tables']['simulacoes']['Insert']) {
          const { data: result, error } = await client
            .from('simulacoes')
            .insert(data)
            .select()
            .single();
          
          if (error) throw error;
          return result;
        },

        async getSimulacoes(limit = 1000) {
          const { data, error } = await client
            .from('simulacoes')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
          
          if (error) throw error;
          return data;
        },

        async updateSimulacaoStatus(id: string, status: string) {
          const { data, error } = await client
            .from('simulacoes')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        },

        // Parceiros
        async createParceiro(data: Database['public']['Tables']['parceiros']['Insert']) {
          const { data: result, error } = await client
            .from('parceiros')
            .insert(data)
            .select()
            .single();
          
          if (error) throw error;
          return result;
        },

        async getParceiros(limit = 50) {
          const { data, error } = await client
            .from('parceiros')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
          
          if (error) throw error;
          return data;
        },

        async updateParceiroStatus(id: string, status: string) {
          const { data, error } = await client
            .from('parceiros')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        },

        // User Journey
        async createUserJourney(data: Database['public']['Tables']['user_journey']['Insert']) {
          const { data: result, error } = await client
            .from('user_journey')
            .insert(data)
            .select()
            .maybeSingle();
          
          if (error) {
            if (error.code === '23505') {
              const { data: upsertResult, error: upsertError } = await client
                .from('user_journey')
                .upsert(data, { onConflict: 'session_id' })
                .select()
                .maybeSingle();
              
              if (upsertError) throw upsertError;
              return upsertResult;
            }
            throw error;
          }
          return result;
        },

        async updateUserJourney(sessionId: string, data: Database['public']['Tables']['user_journey']['Update']) {
          const { data: result, error } = await client
            .from('user_journey')
            .update(data)
            .eq('session_id', sessionId)
            .select()
            .maybeSingle();
          
          if (error) throw error;
          return result;
        },

        async getUserJourney(sessionId: string) {
          const { data, error } = await client
            .from('user_journey')
            .select('*')
            .eq('session_id', sessionId)
            .maybeSingle();
          
          if (error) throw error;
          return data;
        },

        // Blog Posts - lazy loaded
        async getAllBlogPosts() {
          const { data, error } = await client
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          return data || [];
        },

        async getPublishedBlogPosts() {
          const { data, error } = await client
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          return data || [];
        },

        async getBlogPostById(id: string) {
          const { data, error } = await client
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          return data;
        },

        async getBlogPostBySlug(slug: string) {
          const { data, error } = await client
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();
          
          if (error) throw error;
          return data;
        },

        async createBlogPost(data: Database['public']['Tables']['blog_posts']['Insert']) {
          const { data: result, error } = await client
            .from('blog_posts')
            .insert(data)
            .select()
            .single();
          
          if (error) throw error;
          return result;
        },

        async updateBlogPost(id: string, data: Database['public']['Tables']['blog_posts']['Update']) {
          const { data: result, error } = await client
            .from('blog_posts')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
          
          if (error) throw error;
          return result;
        },

        async deleteBlogPost(id: string) {
          const { error } = await client
            .from('blog_posts')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          return true;
        },

        // Storage operations
        async uploadBlogImage(file: File, fileName?: string): Promise<string> {
          await this.ensureBlogImagesBucketExists();

          const fileExt = file.name.split('.').pop();
          const finalFileName = fileName || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
          const filePath = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${finalFileName}`;

          const { data, error } = await client.storage
            .from('blog-images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) throw error;

          const { data: publicURL } = client.storage
            .from('blog-images')
            .getPublicUrl(filePath);

          return publicURL.publicUrl;
        },

        async ensureBlogImagesBucketExists(): Promise<void> {
          try {
            const { data: buckets, error: listError } = await client.storage.listBuckets();
            
            if (listError) {
              console.warn('Erro ao listar buckets:', listError);
              return;
            }

            const bucketExists = buckets?.some(bucket => bucket.name === 'blog-images');
            
            if (!bucketExists) {
              console.log('Bucket blog-images não existe, criando...');
              
              const { data: createData, error: createError } = await client.storage.createBucket('blog-images', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                fileSizeLimit: 5242880
              });

              if (createError) {
                console.error('Erro ao criar bucket blog-images:', createError);
                throw new Error(`Falha ao criar bucket de imagens: ${createError.message}`);
              }

              console.log('Bucket blog-images criado com sucesso:', createData);
            }
          } catch (error) {
            console.error('Erro ao verificar/criar bucket:', error);
          }
        }
      };

      // Cache da API
      supabaseApi = api;
      loadingPromise = null; // Limpa a promise após sucesso

      return { supabase: client, supabaseApi: api };
    })
    .catch(error => {
      loadingPromise = null; // Limpa a promise em caso de erro
      console.error('Error loading Supabase client:', error);
      throw error;
    });
  
  return loadingPromise;
}

/**
 * Getter para o cliente Supabase (lazy loaded)
 */
export async function getSupabaseClient() {
  const { supabase } = await loadSupabaseClient();
  return supabase;
}

/**
 * Getter para a API Supabase (lazy loaded)
 */
export async function getSupabaseApi() {
  const { supabaseApi } = await loadSupabaseClient();
  return supabaseApi;
}

/**
 * Função para preload do cliente Supabase
 * Útil quando você sabe que vai precisar do cliente em breve
 */
export function preloadSupabaseClient() {
  if (!supabaseClient && !loadingPromise) {
    loadSupabaseClient().catch(error => {
      console.error('Error preloading Supabase client:', error);
    });
  }
}

export default { getSupabaseClient, getSupabaseApi, preloadSupabaseClient };