import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
    let query = event.queryStringParameters;
    // let limit = query && query.limit ? parseInt(query.limit) : 100;
    let status = query && query.status ? query.status : 'available';
    //let status = query && query.status ? query.status :"";
    let date = query && query.created_date ? query.created_date : "";
    // let capacity = query && query.capacity ? query.capacity : "";
    let weight = query && query.weight ? query.weight : "";
    let type = query && query.type ? query.type : "";
    let truck_reg = query && query.truck_reg ? query.truck_reg : "";
    // console.log("================event=========================", event);
    // console.log("================status=========================", status);
    // console.log("================type=========================", type);
    // console.log("================weight=========================", weight);
    // console.log("================limit=========================", limit);
    var params;
    var queryCount;
    try {

        if (!date && !weight && !type) {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status",
                ExpressionAttributeNames: {
                    '#status': 'status',
                    '#truck_reg': 'truck_reg'

                },
                ExpressionAttributeValues: {
                    ":status": status,
                    ":truck_reg": truck_reg
                },
                FilterExpression: "contains(#truck_reg, :truck_reg)",

                //       Limit: limit,
                ScanIndexForward: true
            };
            console.log("=================helllooooo koi thake======000000=========");

        } else if (!date && !type) {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status",
                ExpressionAttributeNames: {
                    '#status': 'status',
                    "#weight": 'weight',
                },
                ExpressionAttributeValues: {
                    ":status": status,
                    ":weight": weight
                },
                FilterExpression: "begins_with(#weight, :weight)",
                //  Limit: limit,
                ScanIndexForward: true
            };
            console.log("=================helllooooo koi thake==========1111=====");
        } else if (!date && !weight) {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status",
                ExpressionAttributeNames: {
                    '#status': 'status',
                    "#type": 'type',
                },
                ExpressionAttributeValues: {
                    ":status": status,
                    ":type": type
                },
                FilterExpression: "begins_with(#type, :type)",
                //    Limit: limit,
                ScanIndexForward: true
            };
            console.log("=================helllooooo koi thake=========22222======");
        } else if (!weight && !type) {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
                ExpressionAttributeNames: {
                    '#status': 'status',
                    "#created_date": 'created_date',
                },
                ExpressionAttributeValues: {
                    ":status": status,
                    ":created_date": date
                },
                //      Limit: limit,
                ScanIndexForward: true
            };
            console.log("=================helllooooo koi thake=========33333======");
        } else if (!date) {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status",
                ExpressionAttributeNames: {
                    '#status': 'status',
                    '#weight': 'weight',
                    '#type': 'type',
                },
                ExpressionAttributeValues: {
                    ":status": status,
                    ':weight': weight,
                    ':type': type
                },
                FilterExpression: "begins_with(#weight, :weight) AND begins_with(#type, :type)",
                //    Limit: limit,
                ScanIndexForward: true
            };
            console.log("=================helllooooo koi thake==========444444=====");
        } else if (!weight) {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
                ExpressionAttributeNames: {
                    '#status': 'status',
                    '#created_date': 'created_date',
                    '#type': 'type',
                },
                ExpressionAttributeValues: {
                    ":status": status,
                    ':created_date': date,
                    ':type': type
                },
                FilterExpression: "begins_with(#type, :type)",
                //     Limit: limit,
                ScanIndexForward: true
            };
            console.log("=================helllooooo koi thake==========5555=====");
        } else if (!type) {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
                ExpressionAttributeNames: {
                    '#status': 'status',
                    '#created_date': 'created_date',
                    '#weight': 'weight'
                },
                ExpressionAttributeValues: {
                    ":status": status,
                    ':created_date': date,
                    ':weight': weight
                },
                FilterExpression: "begins_with(#weight, :weight)",
                //      Limit: limit,
                ScanIndexForward: true
            };
            console.log("=================helllooooo koi thake==========6666=====");
        } else {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
                ExpressionAttributeNames: {
                    '#status': 'status',
                    '#created_date': 'created_date',
                    '#weight': 'weight',
                    '#type': 'type',
                },
                ExpressionAttributeValues: {
                    ":status": status,
                    ':created_date': date,
                    ':weight': weight,
                    ':type': type
                },
                FilterExpression: "begins_with(#weight, :weight) AND begins_with(#type, :type)",
                //     Limit: limit,
                ScanIndexForward: true
            };
            console.log("=================helllooooo koi thake==========7777=====");
        }

        queryCount = 1;
        //loop cholbe
        var result = await dynamoDbLib.call("query", params);
        //  queryCount += 1;
        console.log("===========outside loop===queryCount================", queryCount);
        if (result.LastEvaluatedKey) {
            //  console.log("=================result=====before =========",result.Limit);
            params.ExclusiveStartKey = result.LastEvaluatedKey;
            result = await dynamoDbLib.call("query", params);
            console.log("=================result.LastEvaluatedKey==============", result.LastEvaluatedKey);
            queryCount = +1;
            // console.log("=================result====after==========",result.Limit);
            console.log("===========in side loop===queryCount================", queryCount);
        }
        // while (result.LastEvaluatedKey) {
        //   if (result.LastEvaluatedKey) {
        //     //  console.log("=================result=====before =========",result.Limit);
        //     params.ExclusiveStartKey = result.LastEvaluatedKey;
        //     result = await dynamoDbLib.call("query", params);
        //     console.log("=================result.LastEvaluatedKey==============", result.LastEvaluatedKey);
        //     queryCount = +1;
        //     // console.log("=================result====after==========",result.Limit);
        //     console.log("===========in side loop===queryCount================", queryCount);
        //   }
        // }
        console.log("==============queryCount================", queryCount);
        return success({
            data: result.Items,
            isExecuted: true
        });
    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}