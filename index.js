// invoker.js
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const uuid = require('uuid');

exports.handler = async (event) => {
    try {
        // Parse input from the HTTP POST body
        const input = JSON.parse(event.body);

        // Invoke the second Lambda function
        const response = await lambda.invoke({
            FunctionName: 'arn:aws:lambda:us-east-2:381492040329:function:stc-lambdaToInvoke', // Replace with actual function name or ARN
            InvocationType: 'RequestResponse', // To get a direct response back
            Payload: JSON.stringify(input) // Pass the input JSON to the second Lambda
        }).promise();

        // Parse and log the response from the second Lambda
        const responseJson = JSON.parse(response.Payload);

        console.log(responseJson);

        return {
            statusCode: 200,
            body: JSON.stringify(responseJson)
        };

    } catch (error) {
        console.error("Error invoking Lambda function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to invoke Lambda function" })
        };
    }
};
