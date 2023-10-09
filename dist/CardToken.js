"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const mongodb_1 = require("mongodb");
const database_config_1 = require("./database.config");
const validationUtils_1 = require("./validationUtils");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestBody = JSON.parse(event.body);
        const { card_number, cvv, expiration_month, expiration_year, email } = requestBody;
        if (card_number.length >= 13 && card_number.length <= 16 &&
            (0, validationUtils_1.isValidCreditCard)(card_number) &&
            (0, validationUtils_1.isValidCVV)(cvv) &&
            (0, validationUtils_1.isValidExpirationMonth)(expiration_month) &&
            (0, validationUtils_1.isValidExpirationYear)(expiration_year) &&
            email.length >= 5 && email.length <= 100 &&
            (0, validationUtils_1.isValidEmail)(email)) {
            // Crear token
            const randomToken = (0, validationUtils_1.generateRandomToken)(16);
            //guradar datos
            const client = new mongodb_1.MongoClient(database_config_1.default.uri);
            // Seleccionar la base de datos y la colección
            const database = client.db('bd');
            const collection = database.collection('card');
            // Crear un documento con los datos
            const document = {
                card_number,
                cvv,
                expiration_month,
                expiration_year,
                email,
                randomToken,
                createdAt: new Date() // Establecer la fecha y hora actual
            };
            yield collection.insertOne(document);
            //se borra en 15 minutos
            yield collection.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 900 });
            yield client.close();
            // Respuesta exitosa
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Solicitud POST exitosa',
                    body: requestBody,
                    token: randomToken
                })
            };
        }
        else {
            // Respuesta de error para datos no válidos
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Datos de solicitud no válidos' })
            };
        }
    }
    catch (error) {
        // Manejar errores
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error en la solicitud POST' })
        };
    }
});
exports.handler = handler;
