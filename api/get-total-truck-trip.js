import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let query = event.queryStringParameters;
    let status = query && query.status ? query.status : 'consignmentDone';
    // let created_date = query && query.created_at ? query.created_date : "";

    var params;
    try {
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
            ScanIndexForward: false
        };

        var result = await dynamoDbLib.call("query", params);
        var totalTruckTripCount = 0;

        while (result.LastEvaluatedKey) {
            params.ExclusiveStartKey = result.LastEvaluatedKey;
            result = await dynamoDbLib.call("query", params);
        }
        result.Items.forEach(element => {
            totalTruckTripCount = totalTruckTripCount + parseInt(element.number_of_consignment);
        });

        return success({
            totalCompleted: totalTruckTripCount
        });
    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}