import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
    const data = JSON.parse(event.body);
    console.log("=========data=========",data);
    let query = event.queryStringParameters;
   // let order_id = query && query.order_id ? query.order_id : '';
    let pk = query && query.pk ? query.pk : '';
    let sk = query && query.sk ? query.sk : '';
    //console.log("============order_id   StringParameters==============", order_id);
    var params;
    try {
         params = {
            TableName: process.env.tableName,
            Key: {
                pk: pk,
                sk: sk
            },
           // ConditionExpression: "order_id = :oi",
            UpdateExpression: 'set #information = list_append(if_not_exists(#information, :empty_list), :information)',
            ExpressionAttributeNames: {
                '#orientation': 'orientation'
              },
              ExpressionAttributeValues: {
              //  ":oi": order_id,
                ':information': data,
                ':empty_list': []
              },
            ReturnValues: "ALL_NEW"
        };


        await dynamoDbLib.call("update", params);
        return success({
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}
