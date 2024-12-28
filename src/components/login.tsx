import api from "../services/api";
import { useAuth } from "../contexts/authContext";
import { AccountsService } from "../services/accountsService";

export default function Login() {
  const { authToken, setToken } = useAuth();

  const login = async () => {
    const response = await AccountsService.login(
      "admin@admin.com",
      "!Admin123"
    );
    setToken(response.data.result!.accessToken);
  };

  const testSecuredEndpoint = async () => {
    const response = await api.get("test");
    const data = await response.data;
    console.log(data);
  };

  return (
    <div>
      <h1>Login</h1>
      <h1>{authToken}</h1>
      <button onClick={login}>This is a button</button>
      <button onClick={testSecuredEndpoint}>This is a button</button>
    </div>
  );
}
