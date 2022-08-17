import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let query = event.queryStringParameters;
    let status = query && query.status ? query.status : "consignmentDone";
    let created_date = query && query.created_at ? query.created_date : "";

    var params;
    try {
        if (!created_date) {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status",
                ExpressionAttributeNames: {
                    '#status': 'status'
                },
                ExpressionAttributeValues: {
                    ":status": status
                },
                Select: "COUNT",
                ScanIndexForward: false
            };
        }

        var result = await dynamoDbLib.call("query", params);
        var count = result.Count;

        while (result.LastEvaluatedKey) {
            params.ExclusiveStartKey = result.LastEvaluatedKey;
            result = await dynamoDbLib.call("query", params);
            count = count + result.Count;
        }

        return success({
            totalCompleted: count
        });
    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}