import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    // let getQuery = ["orderCancelled", "consignmentDone", "ordersPlaced", "detailsCollected", "orderConfirmed",
    //     "loadCompleted", "inTransit", "unloadComplete"];
    let getQuery = ["orderCancelled", "consignmentDone", "ordersPlaced", "detailsCollected", "orderConfirmed",
  ];

    var params;
    var orderNum = 0;
    var cancelNum = 0;
    var progressNum = 0;

    try {

        for (var e = 0; e < getQuery.length; e++) {

            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status",
                ExpressionAttributeNames: {
                    '#status': 'status',

                },
                ExpressionAttributeValues: {
                    ":status": getQuery[e],
                },
                Select: "COUNT",
                ScanIndexForward: false
            };

            var result = await dynamoDbLib.call("query", params);
            var count = result.Count;

            while (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                result = await dynamoDbLib.call("query", params);
                count += result.Count;
            }

            if (getQuery[e] === "orderCancelled") {
                cancelNum = count;
            } else if (getQuery[e] === "consignmentDone") {
                orderNum = count;
            } else {
                progressNum += count;
            }

            count = null;

        }

     //   var total = orderNum + cancelNum + progressNum;

        // orderNum = parseInt(((orderNum / total) * 100));
        // progressNum = parseInt(((progressNum / total)) * 100);
        // cancelNum = (100 - (orderNum + progressNum));

     //   total = null;

        // return success({
        //     data: [
        //         {
        //             "total_completed": orderNum + "%",
        //             "total_cancelled": cancelNum + "%",
        //             "on_progress": progressNum + "%"
        //         }
        //     ],
        //     isExecuted: true
        // });
        return success({
            data: [
                {
                    label: "Successful",
                    value: orderNum,
                },
                {
                    label: "In Progress",
                    value: progressNum
                },
                {
                    label: "Cancelled",
                    value: cancelNum
                }
            ],
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}