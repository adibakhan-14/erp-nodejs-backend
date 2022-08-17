import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let query = event.queryStringParameters;
    let limit = query && query.limit ? parseInt(query.limit) : 100;
    let sk = query && query.sk;
    let pk = query && query.pk ? query.pk : "";


    var params;
    try {
        if (!pk) {
            console.log("customer order 1111111111111111");
            params = {
                TableName: process.env.tableName,
                IndexName: "reverse-index",
                KeyConditionExpression: "#sk = :sk",
                ExpressionAttributeNames: {
                    '#sk': 'sk'
                },
                ExpressionAttributeValues: {
                    ":sk": sk
                },
                Limit: limit,
                ScanIndexForward: true
            };
        } else {
            console.log("customer order 2222222222222222");

            params = {
                TableName: process.env.tableName,
                IndexName: "reverse-index",
                KeyConditionExpression: "#sk = :sk AND begins_with(#pk, :pk)",
                ExpressionAttributeNames: {
                    "#sk": 'sk',
                    '#pk': 'pk'
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
        console.log(result);
        // var objItems = result.Items;

        // var temp = 0;
        // for (let i = 0; i < objItems.length - 1; i++) {
        //     // console.log(objItems[i].count);
        //     temp = objItems[i].count + temp;
        //     objItems[i] = temp;
        // }

        // objItems.push({
        //     'temp': temp
        // });
        // console.log(objItems, 'laaaalalalaa');

        // Object.assign(result.Items, { "total_orders": sum });
        // console.log(result.Items, "porseeeeeeeeeeeeee");
        if (result.LastEvaluatedKey) {
            params.ExclusiveStartKey = result.LastEvaluatedKey;

            result = await dynamoDbLib.call("query", params);


        }

        return success({
            data: result.Items,
            isExecuted: true,

        });
    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }


}