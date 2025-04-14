import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Api {
  constructor() {
    this.urlLogin = "https://servicios2.uptc.edu.co/SiRestauranteBackEnd/login";
    this.authToken = null;
    this.tokenExpiry = null;
  }

  async login() {
    const user = await AsyncStorage.getItem('user');
    const password = await AsyncStorage.getItem('password');

    if (!user || !password) {
      throw new Error("Usuario o contraseña no encontrados en AsyncStorage");
    }

    const body = { user, password };

    const headersLogin = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(this.urlLogin, {
        method: "POST",
        headers: headersLogin,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Login fallido: ${response.status}`);
      }

      const data = await response.json();
      this.authToken = data.validateToken;

      const now = new Date();
      this.tokenExpiry = now.getTime() + 6 * 60 * 60 * 1000; // 6 horas

      return this.authToken;
    } catch (error) {
      console.error("Error en el login:", error);
      throw error;
    }
  }

  async ensureValidToken() {
    if (!this.authToken || Date.now() >= this.tokenExpiry) {
      await this.login();
    }
  }

  async sirest(month, day, type) {
    await this.ensureValidToken();

    const user = await AsyncStorage.getItem("user");
    const year = new Date().getFullYear();

    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');

    const url = `https://servicios2.uptc.edu.co/SiRestauranteBackEnd/Menus/menusFechaRestaurante/1/${type}/${year}-${mm}-${dd}`;

    const headers = {
      Accept: "application/json",
      Authentication: this.authToken,
      Program:
        "LchYI/jKSgcZTdYZ3VppnZkBx3fTVchhQg6AhruDu1HLXrEv/6NjJCNjlY2jIpUwg1M8ipkosHsNovSQZjaDJg==",
      UpdateToken:
        "TsEpyeRh6s1WveQc/2AnPUNVj8KAHu3CilgoZgjxYJeAN187kS2ZysusIOJYjLW8QpCN+bD9lnoPSMKRLguezOeRskCAg4rHBgxdpEsvhSk=",
      User: user || '',
    };

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en la petición de comida:", error);
      return null;
    }
  }
}
