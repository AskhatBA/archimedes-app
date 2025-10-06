import { createContext, useContext, FC, ReactNode, useMemo } from 'react';

interface CardRadioGroupContextValues {
  onChange?: (value: string) => void;
  value?: string;
}

const CardRadioGroupContext = createContext<CardRadioGroupContextValues>(null);

export const CardRadioGroupProvider: FC<{
  children: ReactNode;
  onChange?: (value: string) => void;
  value?: string;
}> = ({ children, onChange, value }) => {
  const values = useMemo(() => ({ value, onChange }), [value, onChange]);

  return (
    <CardRadioGroupContext.Provider value={values}>
      {children}
    </CardRadioGroupContext.Provider>
  );
};

export const useCardRadioGroup = () => useContext(CardRadioGroupContext);
