import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/ImageUploader';
import { ImageUploadService } from '@/services/imageUploadService';

const ImageUploadTester: React.FC = () => {
  const [testImage, setTestImage] = useState<string>('');
  const [storageStats, setStorageStats] = useState<any>(null);

  const handleImageUpload = (imageUrl: string) => {
    setTestImage(imageUrl);
    updateStats();
  };

  const handleImageRemove = () => {
    setTestImage('');
    updateStats();
  };

  const updateStats = () => {
    const stats = ImageUploadService.getStorageStats();
    setStorageStats(stats);
  };

  const handleCleanup = () => {
    ImageUploadService.cleanupLocalImages();
    updateStats();
    alert('Limpeza de imagens concluída!');
  };

  React.useEffect(() => {
    updateStats();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🧪 Teste de Upload de Imagens</CardTitle>
        <p className="text-sm text-gray-600">
          Use este teste para verificar se o sistema de upload está funcionando corretamente
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Upload de Teste</h4>
            <ImageUploader
              onImageUpload={handleImageUpload}
              currentImage={testImage}
              onImageRemove={handleImageRemove}
              maxSize={5}
            />
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Estatísticas de Armazenamento</h4>
            {storageStats && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Imagens locais:</span>
                  <span className="font-mono">{storageStats.localCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tamanho total:</span>
                  <span className="font-mono">{storageStats.localSizeMB} MB</span>
                </div>
                <Button 
                  onClick={handleCleanup}
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                >
                  🧹 Limpar Imagens Antigas
                </Button>
              </div>
            )}
          </div>
        </div>

        {testImage && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Resultado do Upload:</h4>
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                ✅ Upload realizado com sucesso!
              </p>
              <p className="text-xs text-green-600 mt-1 font-mono break-all">
                URL: {testImage.substring(0, 100)}...
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-md">
          <p className="font-medium text-blue-700 mb-1">ℹ️ Como funciona:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-600">
            <li>Primeiro tenta upload no Supabase Storage</li>
            <li>Se falhar, usa armazenamento local (base64)</li>
            <li>Imagens são otimizadas automaticamente</li>
            <li>Limpeza automática de imagens antigas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadTester;