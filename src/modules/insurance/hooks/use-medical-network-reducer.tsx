import { useReducer } from 'react';

interface State {
  city: string;
  query: string;
  currentClinicType?: number;
}

type Action =
  | { type: 'SET_CITY'; payload: string }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_CLINIC_TYPE'; payload?: number };

const initialState: State = {
  city: '',
  query: '',
  currentClinicType: undefined,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_CLINIC_TYPE':
      return { ...state, currentClinicType: action.payload };
    default:
      return state;
  }
};

export const useMedicalNetworkReducer = () => {
  return useReducer(reducer, initialState);
};
