export class RecuperarPassword {

  token?: string | null;
  password?: string;

  constructor(token: string | null, password: string) {
    this.token = token;
    this.password = password;
  }
}
