import axios from 'axios';
import {API_URL} from './api-host';

const SERVICE_API = API_URL + 'auth/';


class AuthService {
  login(login, password) {
    return axios
      .post(SERVICE_API + "login", {
        login,
        password
      })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(login, password, confirm_password) {
    return axios.post(SERVICE_API + "signup", {
      login,
      password,
      confirm_password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
  checkAuth(role) {
     if(role == 'MANAGER')
       return true;
     return false;
  }
}

export default new AuthService();
