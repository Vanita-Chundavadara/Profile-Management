import React, { createContext, useReducer, useContext, useMemo } from 'react';

interface ProfileState {
  id:number,
  name: string;
  email: string;
  age?: number;
}
interface ProfileProviderProps {
    children: React.ReactNode;
  }
  
type State = { users: ProfileState[] };
type Action = 
  | { type: 'SET_PROFILE', payload: ProfileState[] }
  | { type: 'DELETE_PROFILE'; payload: any }
  | { type: 'UPDATE_PROFILE'; payload: any }; 

  const initialState: State = { users: [] };


function profileReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PROFILE':
      return {
        ...state,
        users: action.payload,
      };
      case 'UPDATE_PROFILE':
  return {
    ...state,
    users: state.users.map(user => user.id === action.payload.id ? action.payload : user)
  };
      case 'DELETE_PROFILE':
        return { ...state, users: state.users.filter(user => user.id !== action.payload) };  
        default:
      return state;
  }
}


const ProfileContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(profileReducer, initialState);
  
    const contextValue = useMemo(() => ({ state, dispatch }), [state]);
  
    return (
      <ProfileContext.Provider value={contextValue}>
        {children}
      </ProfileContext.Provider>
    );
  };


  export const useProfileContext = () => {
    const context = useContext(ProfileContext);
    if (!context) {
      throw new Error('useProfileContext must be used within a ProfileProvider');
    }
    return context;
  };
