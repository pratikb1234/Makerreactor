import { createContext, useContext, useState, useEffect, useRef } from 'react';

const CircuitContext = createContext();

export function CircuitProvider({ children }) {
  const [isPowered, setIsPowered] = useState(false);
  const timerRef = useRef(null);

  const [isPowerFlowComplete, setIsPowerFlowComplete] = useState(false);

  const togglePower = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPowered(prev => {
      if (prev) setIsPowerFlowComplete(false); // Reset when turning off
      return !prev;
    });
  };

  useEffect(() => {
    // Auto-power after 8 seconds of inactivity
    timerRef.current = setTimeout(() => {
      setIsPowered(true);
      timerRef.current = null;
    }, 8000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <CircuitContext.Provider value={{ isPowered, togglePower, isPowerFlowComplete, setIsPowerFlowComplete }}>
      {children}
    </CircuitContext.Provider>
  );
}

export function useCircuit() {
  return useContext(CircuitContext);
}
