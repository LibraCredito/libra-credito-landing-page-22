/**
 * Configuração do cliente Supabase
 * 
 * @file supabase.ts
 * @description Configuração centralizada do cliente Supabase para integração com banco de dados
 * 
 * @features
 * - Cliente configurado com URL e API Key
 * - Tipos TypeScript para tabelas
 * - Configurações de segurança
 * 
 * @security
 * - API Key anônima (somente leitura/escrita conforme RLS)
 * - URLs e keys em variáveis de ambiente para produção
 * 
 * @database_schema
 * - simulacoes: Dados de simulação de crédito
 * - user_journey: Tracking de jornada do usuário
 */

import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase - opcionais para desenvolvimento
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Variáveis de fallback para desenvolvimento quando Supabase não está configurado
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase não configurado: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não definidas');
  console.log('🔧 Aplicação funcionará em modo local (sem salvamento de dados)');
}

// Log para debug (apenas em development)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseAnonKey?.substring(0, 20) + '...');
}

// Tipos TypeScript para as tabelas
export interface SimulacaoData {
  id?: string;
  session_id: string;
  nome_completo: string;
  email: string;
  telefone: string;
  cidade: string;
  valor_emprestimo: number;
  valor_imovel: number;
  parcelas: number;
  tipo_amortizacao: string;
  parcela_inicial?: number;
  parcela_final?: number;
  imovel_proprio?: 'proprio' | 'terceiro';
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  status?: string;
}

export interface ParceiroData {
  id?: string;
  session_id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  cnpj?: string;
  tempo_home_equity: string;
  perfil_cliente: string;
  ramo_atuacao: string;
  origem: string;
  mensagem?: string;
  ip_address?: string;
  user_agent?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserJourneyData {
  id?: string;
  session_id: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page: string;
  pages_visited: PageVisit[];
  time_on_site?: number;
  device_info?: DeviceInfo;
  ip_address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PageVisit {
  url: string;
  timestamp: string;
  time_spent?: number;
}

export interface DeviceInfo {
  user_agent: string;
  screen_resolution: string;
  viewport_size: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
}

export interface BlogPostData {
  id?: string;
  title: string;
  description: string;
  category: string;
  content: string;
  image_url?: string;
  slug: string;
  read_time?: number;
  published: boolean;
  featured_post: boolean;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

// Schema do banco para TypeScript
export interface Database {
  public: {
    Tables: {
      simulacoes: {
        Row: SimulacaoData;
        Insert: Omit<SimulacaoData, 'id' | 'created_at'>;
        Update: Partial<Omit<SimulacaoData, 'id' | 'created_at'>>;
      };
      parceiros: {
        Row: ParceiroData;
        Insert: Omit<ParceiroData, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ParceiroData, 'id' | 'created_at'>>;
      };
      user_journey: {
        Row: UserJourneyData;
        Insert: Omit<UserJourneyData, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserJourneyData, 'id' | 'created_at'>>;
      };
      blog_posts: {
        Row: BlogPostData;
        Insert: Omit<BlogPostData, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogPostData, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

// Cliente Supabase tipado com fallback para desenvolvimento
export const supabase = createClient<Database>(
  supabaseUrl || 'https://wprkpdqnmibxphiofoqk.supabase.co', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcmtwZHFubWlieHBoaW9mb3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTA0ODMsImV4cCI6MjAyNTQyNjQ4M30.sb_publishable_xjn_ruSWUfyiqoMIrQfcOw_-YVtj5lr',
  {
    auth: {
      persistSession: false // Não precisamos de autenticação de usuário
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  }
);

// Flag para verificar se Supabase está funcionando
export { isSupabaseConfigured };

// Funções auxiliares para operações no banco
export const supabaseApi = {
  // Teste de conexão
  async testConnection() {
    if (!isSupabaseConfigured) {
      if (import.meta.env.DEV) {
        console.log('🔧 Supabase em modo fallback - conexão simulada');
      }
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('parceiros')
        .select('*')
        .limit(1);
      
      if (error) {
        // Log silencioso para evitar poluição do console
        if (import.meta.env.DEV) {
          console.warn('Supabase connection issue:', error.message);
        }
        return false;
      }
      
      if (import.meta.env.DEV) {
        console.log('✅ Conexão Supabase OK');
      }
      return true;
    } catch (error) {
      // Evitar console errors em produção
      if (import.meta.env.DEV) {
        console.warn('Supabase connection failed:', error);
      }
      return false;
    }
  },

  // Simulações
  async createSimulacao(data: Database['public']['Tables']['simulacoes']['Insert']) {
    if (!isSupabaseConfigured) {
      console.log('📝 Simulação salva em modo local:', data);
      return { ...data, id: 'local-' + Date.now() } as any;
    }

    const { data: result, error } = await supabase
      .from('simulacoes')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async getSimulacoes(limit = 1000) {
    const { data, error } = await supabase
      .from('simulacoes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async updateSimulacaoStatus(id: string, status: string) {
    const { data, error } = await supabase
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
    const { data: result, error } = await supabase
      .from('parceiros')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async getParceiros(limit = 50) {
    const { data, error } = await supabase
      .from('parceiros')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async updateParceiroStatus(id: string, status: string) {
    const { data, error } = await supabase
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
    // Usar insert simples primeiro, depois upsert se necessário
    const { data: result, error } = await supabase
      .from('user_journey')
      .insert(data)
      .select()
      .maybeSingle();
    
    if (error) {
      // Se der erro de conflito, tentar upsert
      if (error.code === '23505') { // código de unique constraint violation
        const { data: upsertResult, error: upsertError } = await supabase
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
    const { data: result, error } = await supabase
      .from('user_journey')
      .update(data)
      .eq('session_id', sessionId)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return result;
  },

  async getUserJourney(sessionId: string) {
    const { data, error } = await supabase
      .from('user_journey')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle(); // Use maybeSingle ao invés de single para evitar erro quando não encontrar
    
    if (error) throw error;
    return data;
  },

  // Analytics
  async getSimulacaoStats() {
    const { data, error } = await supabase
      .rpc('get_simulacao_stats'); // Função SQL customizada
    
    if (error) throw error;
    return data;
  },

  // Blog Posts
  async getAllBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getPublishedBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getBlogPostById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getBlogPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createBlogPost(data: Database['public']['Tables']['blog_posts']['Insert']) {
    const { data: result, error } = await supabase
      .from('blog_posts')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async updateBlogPost(id: string, data: Database['public']['Tables']['blog_posts']['Update']) {
    const { data: result, error } = await supabase
      .from('blog_posts')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async deleteBlogPost(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async getBlogPostsByCategory(category: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getFeaturedBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('featured_post', true)
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Upload de imagem para Supabase Storage
  async uploadBlogImage(file: File, fileName?: string): Promise<string> {
    // Verificar se o bucket existe e criar se necessário
    await this.ensureBlogImagesBucketExists();

    const fileExt = file.name.split('.').pop();
    const finalFileName = fileName || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${finalFileName}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Retornar URL pública da imagem
    const { data: publicURL } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicURL.publicUrl;
  },

  // Garantir que o bucket blog-images existe
  async ensureBlogImagesBucketExists(): Promise<void> {
    try {
      // Verificar se o bucket já existe
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.warn('Erro ao listar buckets:', listError);
        return; // Se não conseguir listar, assume que existe
      }

      const bucketExists = buckets?.some(bucket => bucket.name === 'blog-images');
      
      if (!bucketExists) {
        console.log('Bucket blog-images não existe, criando...');
        
        // Criar o bucket
        const { data: createData, error: createError } = await supabase.storage.createBucket('blog-images', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });

        if (createError) {
          console.error('Erro ao criar bucket blog-images:', createError);
          throw new Error(`Falha ao criar bucket de imagens: ${createError.message}`);
        }

        console.log('Bucket blog-images criado com sucesso:', createData);
      }
    } catch (error) {
      console.error('Erro ao verificar/criar bucket:', error);
      // Não fazer throw aqui para não quebrar o upload se for um erro de permissão
      // O upload vai tentar e se falhar, vai para o fallback local
    }
  },

  async deleteBlogImage(imageUrl: string) {
    // Extrair o path da URL
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'blog-images');
    if (bucketIndex === -1) return false;

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from('blog-images')
      .remove([filePath]);
    
    if (error) throw error;
    return true;
  }
};

export default supabase;
