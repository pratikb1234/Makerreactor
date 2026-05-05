import { createContext, useContext, useState } from 'react';

const CircuitContext = createContext();

export function CircuitProvider({ children }) {
  const [isPowered, setIsPowered] = useState(false);

  const togglePower = () => setIsPowered(!isPowered);

  return (
    <CircuitContext.Provider value={{ isPowered, togglePower }}>
      {children}
    </CircuitContext.Provider>
  );
}

export function useCircuit() {
  return useContext(CircuitContext);
}
