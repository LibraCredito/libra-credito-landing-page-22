/**
 * Serviço para upload de imagens
 * Suporta tanto armazenamento local quanto Supabase Storage
 */

import { supabaseApi, supabase } from '@/lib/supabase';

export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
}

export class ImageUploadService {
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private static readonly LOCAL_STORAGE_KEY = 'libra_blog_images';

  /**
   * Validar arquivo antes do upload
   */
  static validateFile(file: File): string | null {
    // Verificar tipo
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return 'Formato não suportado. Use JPG, PNG, GIF ou WebP';
    }

    // Verificar tamanho
    if (file.size > this.MAX_FILE_SIZE) {
      return `Arquivo muito grande. Máximo permitido: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`;
    }

    return null;
  }

  /**
   * Upload usando Supabase Storage
   */
  private static async uploadToSupabase(file: File): Promise<UploadResult> {
    if (!supabase) {
      throw new Error('SERVICO_INDISPONIVEL: Supabase não configurado');
    }
    try {
      const url = await supabaseApi.uploadBlogImage(file);
      console.log('Upload Supabase realizado com sucesso:', url);
      return {
        url,
        fileName: file.name,
        size: file.size
      };
    } catch (error) {
      console.error('Erro no upload Supabase:', error);
      
      // Fornecer mensagem de erro mais específica
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Falha no upload para Supabase Storage: ${errorMessage}`);
    }
  }

  /**
   * Upload local (convertendo para base64 e armazenando localmente)
   */
  private static async uploadToLocal(file: File): Promise<UploadResult> {
    try {
      // Converter arquivo para base64
      const base64 = await this.fileToBase64(file);
      
      // Gerar nome único
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substr(2, 9);
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `blog-${timestamp}-${randomStr}.${fileExt}`;

      // Criar objeto da imagem
      const imageData = {
        fileName,
        base64,
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };

      // Armazenar no localStorage
      const existingImages = this.getLocalImages();
      existingImages[fileName] = imageData;
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(existingImages));

      // Retornar URL local (base64)
      return {
        url: base64,
        fileName,
        size: file.size
      };
    } catch (error) {
      console.error('Erro no upload local:', error);
      throw new Error('Falha no armazenamento local da imagem');
    }
  }

  /**
   * Converter arquivo para base64
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Obter imagens armazenadas localmente
   */
  private static getLocalImages(): Record<string, any> {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Upload principal - tenta Supabase primeiro, depois fallback local
   */
  static async uploadImage(file: File): Promise<UploadResult> {
    // Validar arquivo
    const validationError = this.validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    // Tentar upload no Supabase primeiro
    try {
      console.log('Tentando upload no Supabase...');
      return await this.uploadToSupabase(file);
    } catch (supabaseError) {
      console.warn('Upload Supabase falhou, usando armazenamento local:', supabaseError);
      
      // Fallback para armazenamento local
      try {
        const result = await this.uploadToLocal(file);
        console.log('Upload local realizado com sucesso');
        return result;
      } catch (localError) {
        console.error('Ambos os métodos de upload falharam:', { supabaseError, localError });
        throw new Error('Erro ao fazer upload da imagem. Tente novamente.');
      }
    }
  }

  /**
   * Deletar imagem (tanto do Supabase quanto local)
   */
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Se for URL do Supabase, tentar deletar de lá
      if (imageUrl.includes('supabase')) {
        if (!supabase) {
          throw new Error('SERVICO_INDISPONIVEL: Supabase não configurado');
        }
        await supabaseApi.deleteBlogImage(imageUrl);
        return true;
      }

      // Se for base64 (local), remover do localStorage
      if (imageUrl.startsWith('data:')) {
        const localImages = this.getLocalImages();
        
        // Encontrar e remover a imagem pelos dados base64
        for (const [fileName, imageData] of Object.entries(localImages)) {
          if ((imageData as any).base64 === imageUrl) {
            delete localImages[fileName];
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(localImages));
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      return false;
    }
  }

  /**
   * Otimizar imagem antes do upload (redimensionar se necessário)
   */
  static async optimizeImage(file: File, maxWidth = 1200, maxHeight = 800, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Redimensionar
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        // Converter de volta para File
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            resolve(file); // Se falhar, retorna o arquivo original
          }
        }, file.type, quality);
      };

      img.onerror = () => resolve(file); // Se falhar, retorna o arquivo original
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Limpar imagens antigas do localStorage
   * Mantém o total armazenado abaixo de aproximadamente 8MB
   */
  static cleanupLocalImages(): void {
    try {
      const localImages = this.getLocalImages();
      const entries = Object.entries(localImages);

      if (entries.length === 0) {
        return;
      }

      // Ordenar por data de upload (mais antigo primeiro)
      const sorted = entries.sort((a, b) => {
        const dateA = new Date((a[1] as any).uploadedAt || 0).getTime();
        const dateB = new Date((b[1] as any).uploadedAt || 0).getTime();
        return dateA - dateB;
      });

      const MAX_BYTES = 8 * 1024 * 1024; // ~8MB
      let totalSize = sorted.reduce(
        (sum, [, img]) => sum + ((img as any).size || 0),
        0
      );

      let removed = 0;
      while (totalSize > MAX_BYTES && sorted.length > 0) {
        const [fileName, data] = sorted.shift() as [string, any];
        totalSize -= (data.size as number) || 0;
        delete localImages[fileName];
        removed += 1;
      }

      if (removed > 0) {
        localStorage.setItem(
          this.LOCAL_STORAGE_KEY,
          JSON.stringify(localImages)
        );
        console.log(`Limpeza concluída: ${removed} imagens removidas`);
      }
    } catch (error) {
      console.error('Erro na limpeza de imagens:', error);
    }
  }

  /**
   * Obter estatísticas de uso de armazenamento
   */
  static getStorageStats(): { localCount: number; localSizeMB: number } {
    try {
      const localImages = this.getLocalImages();
      const entries = Object.values(localImages);
      
      const totalSize = entries.reduce((sum, img: any) => sum + (img.size || 0), 0);
      
      return {
        localCount: entries.length,
        localSizeMB: Number((totalSize / 1024 / 1024).toFixed(2))
      };
    } catch {
      return { localCount: 0, localSizeMB: 0 };
    }
  }

  /**
   * Testar conectividade e funcionalidade do upload
   */
  static async testUploadSystem(): Promise<{
    supabaseWorking: boolean;
    localWorking: boolean;
    bucketExists: boolean;
    error?: string;
  }> {
    const result = {
      supabaseWorking: false,
      localWorking: false,
      bucketExists: false,
      error: undefined as string | undefined
    };

    try {
      // Criar um arquivo de teste pequeno
      const testFile = new File(['test-image-content'], 'test.jpg', { type: 'image/jpeg' });

      // Testar armazenamento local
      try {
        await this.uploadToLocal(testFile);
        result.localWorking = true;
        console.log('✅ Armazenamento local funcionando');
      } catch (error) {
        console.error('❌ Armazenamento local com problemas:', error);
      }

      // Testar Supabase
      try {
        await this.uploadToSupabase(testFile);
        result.supabaseWorking = true;
        result.bucketExists = true;
        console.log('✅ Supabase Storage funcionando');
      } catch (error) {
        console.error('❌ Supabase Storage com problemas:', error);
        result.error = error instanceof Error ? error.message : 'Erro desconhecido no Supabase';
      }

      return result;
    } catch (error) {
      result.error = `Erro geral no teste: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      return result;
    }
  }
}

export default ImageUploadService;