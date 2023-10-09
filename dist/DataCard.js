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
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = new mongodb_1.MongoClient(database_config_1.default.uri);
        yield client.connect(); // Conectar a MongoDB
        const database = client.db('bd');
        const collection = database.collection('card');
        // Obtener el randomToken de la solicitud
        const requestBody = JSON.parse(event.body);
        const randomToken = requestBody.randomToken;
        // Validar que randomToken no sea null y tenga el formato correcto
        if (!randomToken || !/^pk_test_[a-zA-Z0-9]{16}$/.test(randomToken)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'randomToken no válido' }),
            };
        }
        // Realizar la búsqueda en la base de datos por randomToken y proyectar solo ciertos campos
        const result = yield collection.findOne({ randomToken }, {
            projection: {
                card_number: 1,
                expiration_month: 1,
                expiration_year: 1,
            },
        });
        // Verificar si se encontró el randomToken en la base de datos
        if (!result) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'El token a expirado o no existe' }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                datos: result,
            }),
        };
    }
    catch (err) {
        console.error('Error al conectar con MongoDB:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al conectar con la base de datos' }),
        };
    }
    finally {
        if (client) {
            yield client.close(); // Cerrar la conexión con MongoDB
        }
    }
});
exports.handler = handler;
