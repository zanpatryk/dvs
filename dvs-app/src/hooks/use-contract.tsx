import React, { createContext, useContext, useState } from "react";
import { Contract } from "ethers";

type ContractContextType = {
  contract: Contract | null;
  setContract: (c: Contract | null) => void;
};

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: { children: React.ReactNode }) {
  const [contract, setContract] = useState<Contract | null>(null);
  return (
    <ContractContext.Provider value={{ contract, setContract }}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const ctx = useContext(ContractContext);
  if (!ctx) throw new Error("useContract must be used within ContractProvider");
  return ctx;
}