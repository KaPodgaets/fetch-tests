import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";
import { AccountsService } from "../services/accountsService";

interface AuthContextType {
  authToken: string;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useState<string>("");

  const setToken = (token: string) => {
    setAuthToken(token);
  };

  useEffect(() => {
    api.interceptors.request.use(
      (config) => {
        // Modify request config before sending it
        if (authToken) {
          config.headers["Authorization"] = `Bearer ${authToken}`; // Attach token to headers
        }
        return config;
      },
      (error) => {
        // Handle request error
        return Promise.reject(error);
      }
    );
  }, [authToken]);

  useEffect(() => {
    api.interceptors.response.use(
      (response) => {
        // Handle successful response
        return response;
      },
      async (error) => {
        // Handle error responses
        if (error.response.status === 401) {
          const originalRequest = error.config;

          try {
            const response = await AccountsService.refresh();

            setAuthToken(response.data.result!.accessToken);

            originalRequest.headers["Authorization"] = `Bearer ${
              response.data.result!.accessToken
            }`;

            return api(originalRequest);
          } catch {
            setAuthToken("");
          }
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
