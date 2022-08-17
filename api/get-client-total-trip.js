import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let query = event.queryStringParameters;
    let status = query && query.status ? query.status : "consignmentDone";
    let sk = query && query.sk;

    var params;
    try {

        params = {
            TableName: process.env.tableName,
            IndexName: "reverse-index",
            KeyConditionExpression: "#sk = :sk",
            ExpressionAttributeNames: {
                "#sk": "sk",
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":sk": sk,
                ":status": status
            },
            FilterExpression: "begins_with(#status, :status)",
            Select: "COUNT",
            ScanIndexForward: false
        };


        var result = await dynamoDbLib.call("query", params);
        var count = result.Count;

        while (result.LastEvaluatedKey) {
            params.ExclusiveStartKey = result.LastEvaluatedKey;
            result = await dynamoDbLib.call("query", params);
            count = count + result.Count;
        }

        return success({
            totalCompleted: count.toString()
        });
    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}