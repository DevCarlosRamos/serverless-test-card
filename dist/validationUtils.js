"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomToken = exports.isValidEmail = exports.isValidExpirationYear = exports.isValidExpirationMonth = exports.isValidCVV = exports.isValidCreditCard = void 0;
function isValidCreditCard(cardNumber) {
    // Algoritmo de Luhn
    let sum = 0;
    let doubleUp = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let curDigit = parseInt(cardNumber.charAt(i));
        if (doubleUp) {
            if ((curDigit *= 2) > 9)
                curDigit -= 9;
        }
        sum += curDigit;
        doubleUp = !doubleUp;
    }
    return sum % 10 === 0;
}
exports.isValidCreditCard = isValidCreditCard;
function isValidCVV(cvv) {
    return cvv.length >= 3 && cvv.length <= 4;
}
exports.isValidCVV = isValidCVV;
function isValidExpirationMonth(month) {
    const numericMonth = parseInt(month, 10);
    return numericMonth >= 1 && numericMonth <= 12;
}
exports.isValidExpirationMonth = isValidExpirationMonth;
function isValidExpirationYear(year) {
    // Implementación de la validación de año de vencimiento
    const currentYear = new Date().getFullYear();
    const numericYear = parseInt(year, 10);
    return numericYear >= currentYear && numericYear <= currentYear + 5;
}
exports.isValidExpirationYear = isValidExpirationYear;
function isValidEmail(email) {
    // Implementación de la validación de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.es)$/;
    return emailRegex.test(email);
}
exports.isValidEmail = isValidEmail;
function generateRandomToken(length) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }
    return "pk_test_" + token;
}
exports.generateRandomToken = generateRandomToken;
