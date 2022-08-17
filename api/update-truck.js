import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
const date = Date.now();
const moment = require('moment-timezone');

export async function main(event, context) {
    const data = JSON.parse(event.body);
    data.updated_date= moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    data.updated_by= data.updated_by;
    let query = event.queryStringParameters;
    let truck_id = query && query.truck_id? query.truck_id: '';
    console.log("============truck_id  StringParameters==============",truck_id);
    var params;
    try {
         params = {
            TableName: process.env.tableName,
            Key: {
                pk: data.pk,
                sk: data.sk
            },
            ConditionExpression: "truck_id = :ti",
            UpdateExpression: "SET  #cbm = :cbm, #length = :length, #type = :type, #truck_reg = :truck_reg, #updated_by= :updated_by, #updated_date= :updated_date",
            ExpressionAttributeNames: {
                "#cbm" :'cbm',
                "#type": 'type',
                "#length" :'length',
                "#truck_reg" : 'truck_reg',
                "#updated_by": 'updated_by',
                "#updated_date": 'updated_date'

            },
            ExpressionAttributeValues: {
               ":ti": data.truck_id ,
               ":cbm" : data.cbm,
                ":type": data.type,
                ":length" :data.length,
                ":truck_reg" : data.truck_reg,
                ":updated_date": data.updated_date,
                ":updated_by": data.updated_by

            },
            ReturnValues: "UPDATED_NEW"
        };

        await dynamoDbLib.call("update", params);
        return success({
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}
