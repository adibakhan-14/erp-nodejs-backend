import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
const moment = require('moment-timezone');
const date = new Date();


export async function main(event) {
    const data = JSON.parse(event.body);


    data.orientation = data.orientation;
    data.name = data.name;
    data.license_number = data.license_number;
    data.nid_number = data.nid_number;
    data.status = 'returned';
    data.validity = moment(date).format("DD-MM-YYYY");
    data.phone = data.phone;
    data.created_at = Date.now();
    data.created_date = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DD:mm:ss");
    //data.driver_id = (data.license_number.substr(0, 10)) + '_' + (data.name.substr(0, 4)).toLowerCase() + '_' + data.orientation.toLowerCase();
    data.driver_id = data.phone + '_' + data.name.slice(0,4).toLowerCase() + '_' +
    data.orientation.toLowerCase();
    data.pk = data.driver_id;
    data.sk = data.phone;
    data.created_by= data.created_by;
    data.updated_by= data.updated_by;
    data.updated_date= data.updated_date;
    data.previous_status= data.previous_status;
    const params = {
        TableName: process.env.tableName,
        Item: data,
        ConditionExpression: "driver_id <> :di",
        ExpressionAttributeValues: {
            ":di": data.driver_id,
        }
    };
    try {
        await dynamoDbLib.call("put", params);
        return success({
            data: params.Item,
            isExecuted: true
        });
    } catch (error) {
        return failure({ isExecuted: false, error: error });
    }
}