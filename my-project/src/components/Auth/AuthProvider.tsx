import Axios, { AxiosStatic } from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie"; // Import js-cookie to work with cookies


type AuthContextType = {
  token: string;
  user: {
    id:number;
    role: string;
    
  } | null;
  Axios: AxiosStatic;
  setUser: (v: {
    id: number;
    role: string;
    
  } | null) => void;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{
    id: number;
    role: string;
    
  } | null>(null);
  const [token, setToken] = useState(Cookies.get("auth_token") || "");

  useEffect(() => {
    if (sessionStorage.getItem('name')) {
      setUser({id: Number(sessionStorage.getItem("id"))!,role:sessionStorage.getItem("role")! })
      Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      //localStorage.setItem("token", token);
      
      
    } else { /* empty */ }
  }, []);


  const setUserInAuth = (v: {
    id : number;
    role: string;
    
  } | null) => {
    setUser(v);
  };
console.log(user);
  const logOut = useMemo(
    () => () => {
      setUser(null);
      setToken("");
    },
    []
  );

  return (
    <AuthContext.Provider value={{ token, user, Axios, setUser: setUserInAuth, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
