import { MongoClient, Db, Collection } from 'mongodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import config from './database.config';

export const handler: APIGatewayProxyHandler = async (event: any) => {
    let client: MongoClient | undefined;

    try {
        client = new MongoClient(config.uri);
        await client.connect(); // Conectar a MongoDB

        const database: Db = client.db('bd');
        const collection: Collection = database.collection('card');

        // Obtener el randomToken de la solicitud
        const requestBody = JSON.parse(event.body);
        const randomToken: string = requestBody.randomToken;

        // Validar que randomToken no sea null y tenga el formato correcto
        if (!randomToken || !/^pk_test_[a-zA-Z0-9]{16}$/.test(randomToken)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'randomToken no válido' }),
            };
        }

        // Realizar la búsqueda en la base de datos por randomToken y proyectar solo ciertos campos
        const result = await collection.findOne(
            { randomToken },
            {
                projection: {
                    card_number: 1,
                    expiration_month: 1,
                    expiration_year: 1,
                },
            }
        );

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
    } catch (err) {
        console.error('Error al conectar con MongoDB:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al conectar con la base de datos' }),
        };
    } finally {
        if (client) {
            await client.close(); // Cerrar la conexión con MongoDB
        }
    }
};
