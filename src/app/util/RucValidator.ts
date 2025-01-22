export class RucValidator {
  /**
   * Verifica si un RUC ecuatoriano es válido.
   * @param ruc - El número de RUC a validar.
   * @returns `true` si el RUC es válido, `false` en caso contrario.
   */
  static validarRuc(ruc: string): boolean {
     // Verificar que tenga 13 dígitos
  if (!/^\d{13}$/.test(ruc)) {
    return false;
  }

  // Extraer los primeros 10 dígitos (cédula base)
  const cedula = ruc.substring(0, 10);
  const tercerDigito = parseInt(ruc.charAt(2), 10);

  // Validar según el tipo de RUC
  if (tercerDigito < 6) {
    // RUC de persona natural: validar la cédula y el sufijo "001"
    if (!this.validarCedula(cedula)) {
      return false;
    }
    return ruc.endsWith('001');
  } else if (tercerDigito === 6) {
    // RUC de entidad pública
    return this.validarEntidadPublica(ruc);
  } else if (tercerDigito === 9) {
    // RUC de sociedad privada o extranjera
    return this.validarSociedadPrivada(ruc);
  }

  // Si no corresponde a ningún tipo válido, retornar false
  return false;
  }

  /**
   * Verifica si una cédula ecuatoriana es válida (10 primeros dígitos del RUC).
   * @param cedula - Los 10 primeros dígitos de la cédula o RUC.
   * @returns `true` si la cédula es válida, `false` en caso contrario.
   */
  private static validarCedula(cedula: string): boolean {
    if (!/^\d{10}$/.test(cedula)) {
      return false;
    }

    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) {
      return false;
    }

    const digitoVerificador = parseInt(cedula.charAt(9), 10);
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let digito = parseInt(cedula.charAt(i), 10) * coeficientes[i];
      if (digito >= 10) {
        digito -= 9;
      }
      suma += digito;
    }

    const modulo = 10;
    const residuo = suma % modulo;
    const resultado = residuo === 0 ? 0 : modulo - residuo;

    return resultado === digitoVerificador;
  }

  /**
   * Valida RUC de entidades públicas (tercer dígito = 6).
   * @param ruc - El número de RUC de la entidad pública.
   * @returns `true` si el RUC es válido, `false` en caso contrario.
   */
  private static validarEntidadPublica(ruc: string): boolean {
    const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;

    for (let i = 0; i < 8; i++) {
      const digito = parseInt(ruc.charAt(i), 10);
      suma += digito * coeficientes[i];
    }

    const modulo = 11;
    const residuo = suma % modulo;
    const resultado = residuo === 0 ? 0 : modulo - residuo;

    const digitoVerificador = parseInt(ruc.charAt(8), 10);
    return resultado === digitoVerificador && ruc.endsWith('0001');
  }

  /**
   * Valida RUC de sociedades privadas o extranjeras (tercer dígito = 9).
   * @param ruc - El número de RUC de la sociedad privada.
   * @returns `true` si el RUC es válido, `false` en caso contrario.
   */
  private static validarSociedadPrivada(ruc: string): boolean {
    const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;

  console.log(`Validando RUC de sociedad privada: ${ruc}`);
  
  // Paso 1: Calcular la suma ponderada
  for (let i = 0; i < 9; i++) {
    const digito = parseInt(ruc.charAt(i), 10);
    const producto = digito * coeficientes[i];
    suma += producto;
    console.log(`Dígito: ${digito}, Coeficiente: ${coeficientes[i]}, Producto: ${producto}, Suma parcial: ${suma}`);
  }

  // Paso 2: Calcular el residuo
  const modulo = 11;
  const residuo = suma % modulo;
  const resultado = residuo === 0 ? 0 : modulo - residuo;

  console.log(`Suma total: ${suma}, Residuo: ${residuo}, Resultado esperado: ${resultado}`);

  // Paso 3: Comparar con el dígito verificador
  const digitoVerificador = parseInt(ruc.charAt(9), 10);
  const sufijoValido = ruc.endsWith('001');

  console.log(`Dígito verificador esperado: ${resultado}, Dígito en RUC: ${digitoVerificador}, Sufijo válido: ${sufijoValido}`);

  return resultado === digitoVerificador && sufijoValido;
  }
}