import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
export async function main(event, context) {
    try {
        const data = JSON.parse(event.body);
        var params;
        console.log("========================dattaaaaaaupdate status", data);
        data.forEach(async element => {
            if (element.loading_point === " " && element.unloading_point === " " && element.rent_time === " " && element.round_trip === " ") {
                console.log("ami call hoyse mama 1 ");
                params = {
                    TableName: process.env.tableName,
                    Item: element,
                    Key: {
                        pk: element.pk,
                        sk: element.sk
                    },
                    UpdateExpression: "SET #status = :status, #previous_status = :previous_status, #updated_by = :updated_by, #prev_rent_status = :prev_rent_status, #order_id = :order_id, #trip_id = :trip_id",
                    ExpressionAttributeNames: {
                        "#status": 'status',
                        "#previous_status": 'previous_status',
                        "#updated_by": 'updated_by',
                        "#prev_rent_status": 'prev_rent_status',
                        "#order_id": 'order_id',
                        "#trip_id" :  'trip_id'
                        // "#loading_point" : 'loading_point',
                        // "#unloading_point" : 'unloading_point',
                    },
                    ExpressionAttributeValues: {
                        ":status": element.status,
                        ":updated_by": element.updated_by,
                        ":previous_status": element.previous_status,
                        ":prev_rent_status": element.prev_rent_status,
                        ":order_id": element.order_id,
                        ":trip_id": element.trip_id,
                        // ":loading_point" : element.loading_point,
                        // ":unloading_point" :element.unloading_point
                    },
                    ReturnValues: "ALL_NEW"
                };
            } else {
                console.log("ami call hoyse mama ");
                params = {
                    TableName: process.env.tableName,
                    Item: element,
                    Key: {
                        pk: element.pk,
                        sk: element.sk
                    },
                    UpdateExpression: "SET #status = :status, #previous_status = :previous_status, #updated_by = :updated_by, #prev_rent_status = :prev_rent_status, #order_id = :order_id, #loading_point=:loading_point, #unloading_point=:unloading_point, #rent_time=:rent_time, #round_trip=:round_trip,  #trip_id = :trip_id",
                    ExpressionAttributeNames: {
                        "#status": 'status',
                        "#previous_status": 'previous_status',
                        "#updated_by": 'updated_by',
                        "#prev_rent_status": 'prev_rent_status',
                        "#order_id": 'order_id',
                        "#loading_point": 'loading_point',
                        "#unloading_point": 'unloading_point',
                        "#rent_time": 'rent_time',
                        "#round_trip": 'round_trip',
                        "#trip_id" :  'trip_id'
                        //'#product_and_destination':'product_and_destination'
                    },
                    ExpressionAttributeValues: {
                        ":status": element.status,
                        ":updated_by": element.updated_by,
                        ":previous_status": element.previous_status,
                        ":prev_rent_status": element.prev_rent_status,
                        ":order_id": element.order_id,
                        ":loading_point": element.loading_point,
                        ":unloading_point": element.unloading_point,
                        ":rent_time": element.rent_time,
                        ":round_trip": element.round_trip,
                        ":trip_id": element.trip_id,
                        //":product_and_destination":element.product_and_destination
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