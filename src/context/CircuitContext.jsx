import { createContext, useContext, useState, useRef } from 'react';

const CircuitContext = createContext();

export function CircuitProvider({ children }) {
  // Start powered: visitors see the full-colour site and the real headline immediately.
  // The power switch in the hero still lets them toggle it off/on for fun.
  const [isPowered, setIsPowered] = useState(true);
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
