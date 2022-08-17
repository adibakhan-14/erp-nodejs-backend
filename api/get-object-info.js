import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let query = event.queryStringParameters;
    let limit = query && query.limit ? parseInt(query.limit) : 100;
    let pk = query && query.pk;
    let sk = query && query.sk ? query.sk : "";

    var params;
    try {
        if (!sk) {
            console.log("herkj",sk);
            params = {
                TableName: process.env.tableName,
                KeyConditionExpression: "#pk = :pk",
                ExpressionAttributeNames: {
                    '#pk': 'pk'
                },
                ExpressionAttributeValues: {
                    ":pk": pk
                },
                Limit: limit,
                ScanIndexForward: true
            };
        }

        else {
            console.log("herkj");
            params = {
                TableName: process.env.tableName,
                KeyConditionExpression: "#pk = :pk AND begins_with(#sk, :sk)",
                ExpressionAttributeNames: {
                    '#pk': 'pk',
                    "#sk": 'sk'
                },
                ExpressionAttributeValues: {
                    ":sk": sk,
                    ":pk": pk
                },
                Limit: limit,
                ScanIndexForward: true
            };
        }
        var result = await dynamoDbLib.call("query", params);

        if (result.LastEvaluatedKey) {
            params.ExclusiveStartKey = result.LastEvaluatedKey;
            result = await dynamoDbLib.call("query", params);
        }
        return success({
            data: result.Items,
            isExecuted: true
        });
    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}