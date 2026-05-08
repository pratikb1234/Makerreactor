import { createContext, useContext, useState, useEffect, useRef } from 'react';

const CircuitContext = createContext();

export function CircuitProvider({ children }) {
  const [isPowered, setIsPowered] = useState(false);
  const timerRef = useRef(null);

  const [isPowerFlowComplete, setIsPowerFlowComplete] = useState(false);
  const [globalCircuitX, setGlobalCircuitX] = useState(0);

  // Bridge gate: true only after hero circuit line reaches center and fires the bridge animation
  const [isHeroBridgeComplete, setIsHeroBridgeComplete] = useState(false);

  const togglePower = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPowered(prev => {
      if (prev) {
        setIsPowerFlowComplete(false);
        setIsHeroBridgeComplete(false); // Reset bridge when powering off
      }
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
    <CircuitContext.Provider value={{
      isPowered, togglePower,
      isPowerFlowComplete, setIsPowerFlowComplete,
      globalCircuitX, setGlobalCircuitX,
      isHeroBridgeComplete, setIsHeroBridgeComplete,
    }}>
      {children}
    </CircuitContext.Provider>
  );
}

export function useCircuit() {
  return useContext(CircuitContext);
}
