// Lambda 1: UUID Generator and Concat

const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = async (event) => {
    try {
        // Generate UUID
        const uuid = uuidv4();

        // Extract text from query params
        const text = event.queryStringParameters && event.queryStringParameters.text;
        if (!text) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing 'text' query parameter" })
            };
        }

        // Concatenate UUID and text
        const message = `${uuid}-${text}`;

        // Invoke Lambda Function 2 (JWT Encryptor)
        const response = await lambda.invoke({
            FunctionName: 'stc-lambdaToInvoke',  // replace with actual Lambda function name of Lambda 2
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify({ message })
        }).promise();

        // Parse response from Lambda 2
        const result = JSON.parse(response.Payload);

        return {
            statusCode: 200,
            body: JSON.stringify({ encryptedMessage: result.encryptedMessage })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error generating and encrypting message' })
        };
    }
};
