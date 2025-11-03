import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { caseReducer } from './caseReducer';
import type { CaseState, CaseAction } from './types';
import { mockCases } from '@/data/mockCases';

/**
 * Context type definition
 */
interface CaseContextType {
  state: CaseState;
  dispatch: React.Dispatch<CaseAction>;
}

/**
 * Case Context - provides global state for case management
 */
export const CaseContext = createContext<CaseContextType | undefined>(undefined);

/**
 * Initial state with mock data
 */
const initialState: CaseState = {
  cases: mockCases,
  notifications: [],
  loading: false,
  error: null,
};

/**
 * Case Provider Component
 * Wraps the application to provide case management state
 */
export function CaseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(caseReducer, initialState);

  return (
    <CaseContext.Provider value={{ state, dispatch }}>
      {children}
    </CaseContext.Provider>
  );
}

/**
 * Custom hook to use the Case Context
 * Must be used within a CaseProvider
 * 
 * @throws {Error} if used outside of CaseProvider
 * @returns {CaseContextType} The case context value with state and dispatch
 * 
 * @example
 * function MyComponent() {
 *   const { state, dispatch } = useCaseContext();
 *   return <div>{state.cases.length} cases</div>;
 * }
 */
export function useCaseContext(): CaseContextType {
  const context = useContext(CaseContext);
  
  if (context === undefined) {
    throw new Error('useCaseContext must be used within a CaseProvider');
  }
  
  return context;
}

