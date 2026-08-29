
export function nombreEsValido(nombre) {
  const limpio = (nombre || '').trim();
  return limpio.length >= 3 && limpio.length <= 30;
}

// Validación simplificada acordada para esta HU: no se verifica que el correo
// exista de verdad, solo que tenga forma de correo y termine en @gmail.com.
export function emailEsValido(email) {
  const limpio = (email || '').trim().toLowerCase();
  return /^[^\s@]+@gmail\.com$/.test(limpio);
}

// "Segura" para esta práctica = al menos 8 caracteres, con letras y números.
export function passwordEsSegura(password) {
  const pwd = password || '';
  return pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /[0-9]/.test(pwd);
}