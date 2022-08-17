import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let query = event.queryStringParameters;
    let limit = query && query.limit ? parseInt(query.limit) : 100;
    let orientation = query && query.orientation ? query.orientation : 'order';
    let sk = query && query.sk ? query.sk : "";
    let phone = query && query.phone ? query.phone : "";
    let email = query && query.email ? query.email : "";

    var params;
    try {
        if (!sk && !phone && !email) {
            console.log("is it hereeeeeeeeeeeeeeeeeeeee    11111");
            params = {
                TableName: process.env.tableName,
                IndexName: "orientation-index",
                KeyConditionExpression: "#orientation = :orientation",
                ExpressionAttributeNames: {
                    '#orientation': 'orientation'
                },
                ExpressionAttributeValues: {
                    ":orientation": orientation
                },
                Limit: limit,
                ScanIndexForward: true
            };
        } else if (!sk && !email) {
            console.log("is it hereeeeeeeeeeeeeeeeeeeee   2222");
            params = {
                TableName: process.env.tableName,
                IndexName: "orientation-index",
                KeyConditionExpression: "#orientation = :orientation",
                ExpressionAttributeNames: {
                    '#orientation': 'orientation',
                    "#phone": 'phone',
                },
                ExpressionAttributeValues: {
                    ":orientation": orientation,
                    ":phone": phone
                },
                FilterExpression: "begins_with(#phone, :phone)",
                Limit: limit,
                ScanIndexForward: true
            };
        } else if (!sk && !phone) {
            params = {
                TableName: process.env.tableName,
                IndexName: "orientation-index",
                KeyConditionExpression: "#orientation = :orientation",
                ExpressionAttributeNames: {
                    '#orientation': 'orientation',
                    "#email": 'email',
                },
                ExpressionAttributeValues: {
                    ":orientation": orientation,
                    ":email": email
                },
                FilterExpression: "begins_with(#email, :email)",
                Limit: limit,
                ScanIndexForward: true
            };
        } else if (!phone && !email) {
            console.log("is it hereeeeeeeeeeeeeeeeeeeee   3333");
            params = {
                TableName: process.env.tableName,
                IndexName: "orientation-index",
                KeyConditionExpression: "#orientation = :orientation and begins_with(#sk, :sk)",
                ExpressionAttributeNames: {
                    '#orientation': 'orientation',
                    "#sk": 'sk',
                },
                ExpressionAttributeValues: {
                    ":orientation": orientation,
                    ":sk": sk
                },
                Limit: limit,
                ScanIndexForward: true
            };
        } else if (!sk) {
            console.log("is it hereeeeeeeeeeeeeeeeeeeee   4444");
            params = {
                TableName: process.env.tableName,
                IndexName: "orientation-index",
                KeyConditionExpression: "#orientation = :orientation",
                ExpressionAttributeNames: {
                    '#orientation': 'orientation',
                    '#phone': 'phone',
                    '#email': 'email',
                },
                ExpressionAttributeValues: {
                    ":orientation": orientation,
                    ':phone': phone,
                    ':email': email
                },
                FilterExpression: "begins_with(#phone, :phone) AND begins_with(#email, :email)",
                Limit: limit,
                ScanIndexForward: true
            };
        } else if (!phone) {
            console.log("is it hereeeeeeeeeeeeeeeeeeeee 55555");
            params = {
                TableName: process.env.tableName,
                IndexName: "orientation-index",
                KeyConditionExpression: "#orientation = :orientation and begins_with(#sk, :sk)",
                ExpressionAttributeNames: {
                    '#orientation': 'orientation',
                    '#sk': 'sk',
                    '#email': 'email',
                },
                ExpressionAttributeValues: {
                    ":orientation": orientation,
                    ':sk': sk,
                    ':email': email
                },
                FilterExpression: "begins_with(#email, :email)",
                Limit: limit,
                ScanIndexForward: true
            };
        } else if (!email) {
            console.log("is it hereeeeeeeeeeeeeeeeeeeee  666666");
            params = {
                TableName: process.env.tableName,
                IndexName: "orientation-index",
                KeyConditionExpression: "#orientation = :orientation and begins_with(#sk, :sk)",
                ExpressionAttributeNames: {
                    '#orientation': 'orientation',
                    '#sk': 'sk',
                    '#phone': 'phone'
                },
                ExpressionAttributeValues: {
                    ":orientation": orientation,
                    ':sk': sk,
                    ':phone': phone
                },
                FilterExpression: "begins_with(#phone, :phone)",
                Limit: limit,
                ScanIndexForward: true
            };
        } else {

            console.log("is it hereeeeeeeeeeeeeeeeeeeee  777777");
            params = {
                TableName: process.env.tableName,
                IndexName: "orientation-index",
                KeyConditionExpression: "#orientation = :orientation and begins_with(#sk, :sk)",
                ExpressionAttributeNames: {
                    '#orientation': 'orientation',
                    '#sk': 'sk',
                    '#phone': 'phone',
                    '#email': 'email',
                },
                ExpressionAttributeValues: {
                    ":orientation": orientation,
                    ':sk': sk,
                    ':phone': phone,
                    ':email': email
                },
                FilterExpression: "begins_with(#phone, :phone) AND begins_with(#email, :email)",
                Limit: limit,
                ScanIndexForward: true
            };
        }
        var result = await dynamoDbLib.call("query", params);
        console.log(result.Items, "thisssssssssssss");
        if (result.LastEvaluatedKey) {
            params.ExclusiveStartKey = result.LastEvaluatedKey;
            result = await dynamoDbLib.call("query", params);
        }
        return success({
            data: result.Items,
            isExecuted: true
        });
    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}