import crypto from "crypto";

export function createSecretKey(len: number): string {
  const randomBytes = crypto.randomBytes(len);
  const specialChars = "!@#$%^&*_+=-~?";
  const numbers = "0123456789";

  let secretKey = "";
  for (let i = 0; i < len; i++) {
    const randomByte = randomBytes[i];
    const charType = crypto.randomInt(4);

    if (charType === 0) {
      // Lowercase letters
      secretKey += String.fromCharCode((randomByte % 26) + 97);
    } else if (charType === 1) {
      // Uppercase letters
      secretKey += String.fromCharCode((randomByte % 26) + 65);
    } else if (charType === 2) {
      // Numbers
      secretKey += numbers[randomByte % 10];
    } else {
      // Special characters
      const randomIndex = crypto.randomInt(0, specialChars.length);
      secretKey += specialChars[randomIndex];
    }
  }

  return secretKey;
}
