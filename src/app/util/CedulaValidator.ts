export class CedulaValidator {
    /**
     * Verifica si una cédula ecuatoriana es válida.
     * @param cedula - El número de cédula a validar.
     * @returns `true` si la cédula es válida, `false` en caso contrario.
     */
    static validarCedula(cedula: string): boolean {
      // Verificar que la longitud sea 10
      if (!/^\d{10}$/.test(cedula)) {
        return false;
      }
  
      // Extraer el código de provincia (dos primeros dígitos)
      const provincia = parseInt(cedula.substring(0, 2), 10);
      if (provincia < 1 || provincia > 24) {
        return false;
      }
  
      // Extraer el último dígito (dígito verificador)
      const digitoVerificador = parseInt(cedula.charAt(9), 10);
  
      // Calcular el dígito verificador
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
  }