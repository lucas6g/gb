import React, { createContext, useState, useCallback, useEffect } from 'react';

import { AsyncStorage } from 'react-native';
import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}
// dto
export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

// formato dos dados no estado
interface AuthState {
  token: string;
  user: User;
}

interface User {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string;
  token: string;
}

// formato dos dados no contexto de autenticacao
interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isLoading: boolean;
  updateUser(updateUserData: User): void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

const AuthProvider: React.FC = ({ children }) => {
  // para caso o usuario ja tenha efetuado o login uma primeira vez
  const [authData, setAuthData] = useState<AuthState>({} as AuthState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAsyncStorageData() {
      const token = await AsyncStorage.getItem('@GoBarber:token');
      const user = await AsyncStorage.getItem('@GoBarber:user');

      if (token && user) {
        api.defaults.headers.authorization = `Bearer ${token}`;
        setAuthData({ user: JSON.parse(user), token });
      }
      setIsLoading(false);
    }
    loadAsyncStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', { email, password });

    const { token, user } = response.data;

    await AsyncStorage.setItem('@GoBarber:token', token);
    await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

    // apos exatamente ter feito signi
    api.defaults.headers.authorization = `Bearer ${token}`;

    setAuthData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem('@GoBarber:token');
    await AsyncStorage.removeItem('@GoBarber:user');

    // removendo os dados do contexto de authenticacao
    setAuthData({} as AuthState);
  }, []);

  const updateUser = useCallback(async (updateUserData: User) => {
    await AsyncStorage.setItem(
      '@GoBarber:user',
      JSON.stringify(updateUserData),
    );
    setAuthData({
      token: updateUserData.token,
      user: updateUserData,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ signIn, user: authData.user, signOut, isLoading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
