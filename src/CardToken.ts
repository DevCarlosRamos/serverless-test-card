import { APIGatewayProxyHandler } from 'aws-lambda';
import { MongoClient } from 'mongodb';
import config from './database.config'
import {
  isValidCreditCard,
  isValidCVV,
  isValidExpirationMonth,
  isValidExpirationYear,
  isValidEmail,
  generateRandomToken
} from './validationUtils';

export const handler: APIGatewayProxyHandler = async (event: any) => {
  try {
    const requestBody = JSON.parse(event.body);

    const { card_number, cvv, expiration_month, expiration_year, email } = requestBody;

    if (
      card_number.length >= 13 && card_number.length <= 16 &&
      isValidCreditCard(card_number) &&
      isValidCVV(cvv) &&
      isValidExpirationMonth(expiration_month) &&
      isValidExpirationYear(expiration_year) &&
      email.length >= 5 && email.length <= 100 &&
      isValidEmail(email)
    ) {
      // Crear token
      const randomToken: string = generateRandomToken(16);

      //guradar datos

      const client = new MongoClient(config.uri);

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

      await collection.insertOne(document);

      //se borra en 15 minutos
      await collection.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 900 });
      await client.close();

      // Respuesta exitosa
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Solicitud POST exitosa',
          body: requestBody,
          token: randomToken
        })
      };
    } else {
      // Respuesta de error para datos no válidos
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Datos de solicitud no válidos' })
      };
    }
  } catch (error) {
    // Manejar errores
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error en la solicitud POST' })
    };
  }
};
