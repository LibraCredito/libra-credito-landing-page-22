import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileWizard } from '@/components/MobileWizard';
import { ValueStep, TermStep, ContactStep, SummaryStep } from '@/components/MobileWizard/steps';
import TutorGuide from '@/components/TutorGuide';

const validateValue = (data: any) => !!data.loanAmount;
const validateTerm = (data: any) => !!data.loanTerm;
const validateContact = (data: any) => !!(data.name && data.phone && data.phone.length >= 14);

const tutorMessages: Record<string, string> = {
  value: 'Escolha o valor que você precisa para começar a simulação.',
  term: 'Agora selecione em quantos meses deseja pagar.',
  contact: 'Precisamos de alguns dados para entrar em contato com você.',
  summary: 'Confira se está tudo certo antes de finalizar.',
};

const withTutor = (
  Component: React.ComponentType<any>,
  id: string
) => (props: any) => (
  <div className="relative pb-32">
    <Component {...props} />
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <TutorGuide
        message={tutorMessages[id]}
        onNext={props.onNext}
        onBack={props.onBack}
      />
    </div>
  </div>
);

const steps = [
  { id: 'value', title: 'Valor Necessário', component: withTutor(ValueStep, 'value'), validation: validateValue },
  { id: 'term', title: 'Prazo de Pagamento', component: withTutor(TermStep, 'term'), validation: validateTerm },
  { id: 'contact', title: 'Seus Dados', component: withTutor(ContactStep, 'contact'), validation: validateContact },
  { id: 'summary', title: 'Resumo da Simulação', component: withTutor(SummaryStep, 'summary'), validation: () => true },
];

const SimulacaoGuiada = () => {
  const navigate = useNavigate();
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleComplete = (data: any) => {
    setSimulationResult(data);
    navigate('/confirmacao');
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <MobileWizard
      steps={steps}
      onComplete={handleComplete}
      onClose={handleClose}
      initialData={simulationResult || {}}
      saveKey="simulacao-guiada"
    />
  );
};

export default SimulacaoGuiada;
