import { useState } from 'react';
import TextInput from '@/components/TextInput';
import SpeedReader from '@/components/SpeedReader';

const Index = () => {
  const [currentText, setCurrentText] = useState<string | null>(null);

  const handleStartReading = (text: string) => {
    setCurrentText(text);
  };

  const handleBackToInput = () => {
    setCurrentText(null);
  };

  return (
    <div className="min-h-screen">
      {currentText ? (
      <SpeedReader
       words={currentText} onBack={handleBackToInput} />
    ) : (
        <TextInput onStartReading={handleStartReading} />
      )}
    </div>
  );
};

export default Index;
