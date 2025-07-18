import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogService } from '@/services/blogService';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  onImageRemove?: () => void;
  accept?: string;
  maxSize?: number; // em MB
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  currentImage,
  onImageRemove,
  accept = "image/*",
  maxSize = 5,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Verificar se é arquivo
    if (!file) {
      return 'Nenhum arquivo selecionado';
    }

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return 'Apenas arquivos de imagem são permitidos';
    }

    // Verificar tamanho
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `Arquivo muito grande. Máximo permitido: ${maxSize}MB`;
    }

    // Verificar formatos específicos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return 'Formato não suportado. Use JPG, PNG, GIF ou WebP';
    }

    // Verificar se arquivo não está corrompido
    if (file.size === 0) {
      return 'Arquivo parece estar corrompido ou vazio';
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    console.log('Iniciando upload do arquivo:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const validationError = validateFile(file);
    if (validationError) {
      console.error('Erro de validação:', validationError);
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    // Simular progresso de upload
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      console.log('Chamando BlogService.uploadImage...');
      const imageUrl = await BlogService.uploadImage(file);
      console.log('Upload concluído com sucesso. URL:', imageUrl);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        onImageUpload(imageUrl);
        setUploadProgress(0);
        setIsUploading(false);
        setError(null);
      }, 500);

    } catch (error) {
      console.error('Erro detalhado no upload:', error);
      clearInterval(progressInterval);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro inesperado ao fazer upload da imagem';
      
      setError(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, [uploadFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async () => {
    if (currentImage && onImageRemove) {
      try {
        await BlogService.deleteImage(currentImage);
        onImageRemove();
      } catch (error) {
        console.error('Erro ao remover imagem:', error);
        // Ainda assim remove da interface
        onImageRemove();
      }
    }
  };

  if (currentImage && !isUploading) {
    return (
      <div className={`relative group ${className}`}>
        <img
          src={currentImage}
          alt="Imagem do post"
          className="w-full h-48 object-cover rounded-lg border"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={openFileDialog}
              className="bg-white text-black hover:bg-gray-100"
            >
              <Upload className="w-4 h-4 mr-1" />
              Trocar
            </Button>
            {onImageRemove && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4 mr-1" />
                Remover
              </Button>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'bg-gray-50' : 'bg-white'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <div className="w-full max-w-xs">
              <div className="text-sm text-gray-600 mb-1">
                Fazendo upload... {uploadProgress}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="space-y-2">
              <p className="text-gray-600">
                Arraste uma imagem aqui ou{' '}
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  clique para selecionar
                </button>
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG, GIF ou WebP até {maxSize}MB
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ✨ Imagens serão otimizadas automaticamente
              </p>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;