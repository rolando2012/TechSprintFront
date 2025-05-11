import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Stage {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

interface StageContextType {
  stages: Stage[];
  setStages: React.Dispatch<React.SetStateAction<Stage[]>>;
}

const StageContext = createContext<StageContextType | undefined>(undefined);

export const StageProvider = ({ children }: { children: ReactNode }) => {
  const [stages, setStages] = useState<Stage[]>([]);

  return (
    <StageContext.Provider value={{ stages, setStages }}>
      {children}
    </StageContext.Provider>
  );
};

export const useStageContext = (): StageContextType => {
  const context = useContext(StageContext);
  if (!context) {
    throw new Error('useStageContext must be used within a StageProvider');
  }
  return context;
};