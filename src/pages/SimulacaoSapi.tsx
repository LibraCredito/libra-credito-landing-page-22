/**
 * Página de Simulação SAPI
 * 
 * @page SimulacaoSapi
 * @description Página de simulação com integração específica da API SAPI
 * @route /simulacao/sapi
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Calculator from 'lucide-react/dist/esm/icons/calculator';
import Building from 'lucide-react/dist/esm/icons/building';
import Users from 'lucide-react/dist/esm/icons/users';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SimulacaoSapi: React.FC = () => {
  const [formData, setFormData] = useState({
    valorEmprestimo: '',
    valorImovel: '',
    parcelas: 36,
    renda: '',
    cpf: '',
    nome: '',
    email: '',
    telefone: ''
  });

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular chamada para API SAPI
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Resultado simulado
      setResultado({
        valorParcela: 4500,
        totalJuros: 125000,
        valorTotal: 625000,
        taxa: 1.25,
        aprovado: true
      });
    } catch (error) {
      console.error('Erro na simulação SAPI:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      valorEmprestimo: '',
      valorImovel: '',
      parcelas: 36,
      renda: '',
      cpf: '',
      nome: '',
      email: '',
      telefone: ''
    });
    setResultado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/simulacao" 
            className="inline-flex items-center text-libra-blue hover:text-libra-blue/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Simulação
          </Link>
        </div>

        {/* Header da Página */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-libra-navy mb-4">
            Simulação SAPI
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simulação especializada com integração direta à API do SAPI para análise completa de crédito imobiliário.
          </p>
        </div>

        {/* Cards de Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Calculator className="w-12 h-12 text-libra-blue mx-auto mb-4" />
              <h3 className="font-semibold text-libra-navy mb-2">Cálculo Preciso</h3>
              <p className="text-gray-600 text-sm">Análise detalhada com dados do SAPI</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Building className="w-12 h-12 text-libra-blue mx-auto mb-4" />
              <h3 className="font-semibold text-libra-navy mb-2">Avaliação Imobiliária</h3>
              <p className="text-gray-600 text-sm">Integração com base de dados oficial</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="w-12 h-12 text-libra-blue mx-auto mb-4" />
              <h3 className="font-semibold text-libra-navy mb-2">Análise de Risco</h3>
              <p className="text-gray-600 text-sm">Avaliação completa de viabilidade</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className={`${resultado ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : ''}`}>
            {/* Formulário */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-libra-navy">
                  Dados para Simulação SAPI
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  Preencha os dados para análise completa
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Dados Pessoais */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-libra-navy border-b pb-2">
                      Dados Pessoais
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Completo *
                        </label>
                        <Input
                          placeholder="Seu nome completo"
                          value={formData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CPF *
                        </label>
                        <Input
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={(e) => handleInputChange('cpf', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone *
                        </label>
                        <Input
                          placeholder="(11) 99999-9999"
                          value={formData.telefone}
                          onChange={(e) => handleInputChange('telefone', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Renda Mensal *
                      </label>
                      <Input
                        placeholder="R$ 0,00"
                        value={formData.renda}
                        onChange={(e) => handleInputChange('renda', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Dados do Empréstimo */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-libra-navy border-b pb-2">
                      Dados do Empréstimo
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor do Empréstimo *
                        </label>
                        <Input
                          placeholder="R$ 0,00"
                          value={formData.valorEmprestimo}
                          onChange={(e) => handleInputChange('valorEmprestimo', e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor do Imóvel *
                        </label>
                        <Input
                          placeholder="R$ 0,00"
                          value={formData.valorImovel}
                          onChange={(e) => handleInputChange('valorImovel', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Parcelas
                      </label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={formData.parcelas}
                        onChange={(e) => handleInputChange('parcelas', parseInt(e.target.value))}
                      >
                        <option value={36}>36 parcelas</option>
                        <option value={48}>48 parcelas</option>
                        <option value={60}>60 parcelas</option>
                        <option value={72}>72 parcelas</option>
                        <option value={84}>84 parcelas</option>
                        <option value={96}>96 parcelas</option>
                        <option value={120}>120 parcelas</option>
                        <option value={180}>180 parcelas</option>
                      </select>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-libra-blue hover:bg-libra-blue/90 text-white"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Processando SAPI...
                        </div>
                      ) : (
                        <>
                          <Calculator className="w-4 h-4 mr-2" />
                          Simular com SAPI
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="px-6"
                    >
                      Limpar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Resultado */}
            {resultado && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-600">
                    ✅ Simulação SAPI Aprovada
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    Resultado da análise via API SAPI
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        R$ {resultado.valorParcela.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-green-700 font-medium">
                        Valor da parcela mensal
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Taxa de Juros</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {resultado.taxa}% a.m.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total de Juros</p>
                      <p className="text-lg font-semibold text-gray-900">
                        R$ {resultado.totalJuros.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        Próximos Passos
                      </span>
                    </div>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Documentação será enviada por email</li>
                      <li>• Análise de crédito em até 48h</li>
                      <li>• Acompanhamento via WhatsApp</li>
                    </ul>
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => alert('Funcionalidade em desenvolvimento')}
                  >
                    Prosseguir com a Proposta
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SimulacaoSapi;