import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let query = event.queryStringParameters;
    let sk = query && query.sk;

    // let statusArray = ["orderCancelled","consignmentDone", "ordersPlaced", "detailsCollected",
    //     "orderConfirmed", "loadCompleted", "inTransit", "unloadComplete"];
        let statusArray = ["orderCancelled","consignmentDone", "ordersPlaced", "detailsCollected",
        "orderConfirmed"];
    var params;
    var successNum = 0;
    var cancelNum = 0;
    var progressNum = 0;
    var count = 0;

    try {

        for (var e = 0; e < statusArray.length; e++) {

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
                    ":status": statusArray[e]
                },
                Select: "COUNT",
                FilterExpression: "begins_with(#status, :status)",
                ScanIndexForward: false
            };

            var result = await dynamoDbLib.call("query", params);
            count = result.Count;

            while (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                result = await dynamoDbLib.call("query", params);
                count += result.Count;
            }

            if (statusArray[e] === "orderCancelled") {
                cancelNum = count;
            } else if (statusArray[e] === "consignmentDone") {
                successNum = count;
            } else {
                progressNum += count;
            }
        }

        return success({
            data: [
                {
                    label: 'Successful',
                    value: successNum.toString()
                },
                {
                    label: 'Cancelled',
                    value: cancelNum.toString()
                },
                {
                    label: 'On progress',
                    value: progressNum.toString()
                }
            ],
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}