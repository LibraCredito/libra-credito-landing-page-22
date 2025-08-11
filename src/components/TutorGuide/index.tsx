import React from 'react';
import UserCircle from 'lucide-react/dist/esm/icons/user-circle';

interface TutorGuideProps {
  message: string;
  onNext: () => void;
  onBack?: () => void;
}

const TutorGuide: React.FC<TutorGuideProps> = ({ message, onNext, onBack }) => {
  return (
    <div className="flex items-end gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
      <UserCircle className="w-12 h-12 text-libra-blue flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-gray-700">{message}</p>
        <div className="flex justify-end gap-2 mt-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1 text-sm border border-libra-blue text-libra-blue rounded-lg"
            >
              Voltar
            </button>
          )}
          <button
            onClick={onNext}
            className="px-3 py-1 text-sm bg-libra-blue text-white rounded-lg"
          >
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorGuide;
