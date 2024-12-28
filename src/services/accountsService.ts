import axios from "axios";
import { Envelope } from "../models/Envelope";
import { LoginResponse } from "../models/LoginResponse";

const refreshEndpoint = "http://localhost:5098/Accounts/refresh";
const loginEndpoint = "http://localhost:5098/Accounts/login";
export class AccountsService {
  static async refresh() {
    return axios.post<Envelope<LoginResponse>>(
      refreshEndpoint,
      {},
      { withCredentials: true }
    );
  }

  static async login(userEmail: string, password: string) {
    return axios.post<Envelope<LoginResponse>>(
      loginEndpoint,
      { userEmail, password },
      { withCredentials: true }
    );
  }
}
