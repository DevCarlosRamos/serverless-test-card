export function isValidCreditCard(cardNumber: string): boolean {
    // Algoritmo de Luhn
    let sum = 0;
    let doubleUp = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let curDigit = parseInt(cardNumber.charAt(i));
        if (doubleUp) {
            if ((curDigit *= 2) > 9) curDigit -= 9;
        }
        sum += curDigit;
        doubleUp = !doubleUp;
    }
    return sum % 10 === 0;
}

export function isValidCVV(cvv: string): boolean {
    return cvv.length >= 3 && cvv.length <= 4;
}

export function isValidExpirationMonth(month: string): boolean {
    const numericMonth = parseInt(month, 10);
    return numericMonth >= 1 && numericMonth <= 12;
}

export function isValidExpirationYear(year: string): boolean {
    // Implementación de la validación de año de vencimiento
    const currentYear = new Date().getFullYear();
    const numericYear = parseInt(year, 10);
    return numericYear >= currentYear && numericYear <= currentYear + 5;
}

export function isValidEmail(email: string): boolean {
    // Implementación de la validación de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.es)$/;
    return emailRegex.test(email);
}

export function generateRandomToken(length: number): string {
    const characters: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token: string = '';

    for (let i = 0; i < length; i++) {
        const randomIndex: number = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }

    return "pk_test_" + token;
}