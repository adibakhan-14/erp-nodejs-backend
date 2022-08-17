import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
    try {
        const data = JSON.parse(event.body);
        var params;
        console.log(data);
        console.log("===================status ===========a challan", data);
        data.forEach(async element => {
            if ( element.round_trip === " ") {
                console.log("ami call hoyse mama challan ---0");
                console.log("eikane ki AShtese");

                params = {
                    TableName: process.env.tableName,
                    Item: element,
                    Key: {
                        pk: element.pk,
                        sk: element.sk
                    },
                    UpdateExpression: "SET #status = :status, #previous_status = :previous_status, #order_id = :order_id, #trip_id = :trip_id",
                    ExpressionAttributeNames: {
                        "#status": 'status',
                        "#previous_status": 'previous_status',
                        "#order_id": 'order_id',
                        "#trip_id" :  'trip_id'

                    },
                    ExpressionAttributeValues: {
                        ":status": element.status,
                        // ":updated_by": element.updated_by,
                        ":previous_status": element.previous_status,
                        // ":prev_rent_status": element.prev_rent_status,
                        ":order_id": element.order_id,
                        ":trip_id": element.trip_id,


                    },
                    ReturnValues: "ALL_NEW"
                };
            } else {

                console.log("ami call hoyse mama update challan --1");
                params = {
                    TableName: process.env.tableName,
                    Item: element,
                    Key: {
                        pk: element.pk,
                        sk: element.sk
                    },
                    UpdateExpression: "SET #status = :status, #previous_status = :previous_status, #order_id = :order_id,  #trip_id = :trip_id",
                    ExpressionAttributeNames: {
                        "#status": 'status',
                        "#previous_status": 'previous_status',
                        "#order_id": 'order_id',
                        "#trip_id" :  'trip_id'
                    },
                    ExpressionAttributeValues: {
                        ":status": element.status,
                        // ":updated_by": element.updated_by,
                        ":previous_status": element.previous_status,
                        ":order_id": element.order_id,
                         ":trip_id": element.trip_id

                    },
                    ReturnValues: "ALL_NEW"
                };
            }
            await dynamoDbLib.call("update", params);

        });

        await dynamoDbLib.call("update", params);
        return success({
            isExecuted: true
        });
    } catch (e) {
        return failure({ status: false, error: e });
    }
}