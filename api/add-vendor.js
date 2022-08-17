import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const abbreviate = require('abbreviate');
const moment = require('moment-timezone');
const date = new Date();

export async function main(event, context) {

    const data = JSON.parse(event.body);
    data.orientation = data.orientation;
    data.type = data.type;
    data.vendor_name = data.vendor_name;
    data.phone = data.phone;
    data.created_at = Date.now();
    data.created_date = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    data.vendor_id = data.phone + '_' +
        abbreviate(data.vendor_name, { length: 4 }).toLowerCase() + '_' +
        data.orientation.toLowerCase();
    data.pk = data.vendor_id;
    data.sk = data.type;
    data.concernPersonName= data.concernPersonName;
    data.concernPersonPhone= data.concernPersonPhone;
    data.created_by= data.created_by;
    data.updated_by= data.updated_by;
    data.updated_date= data.updated_date;

    const params = {
        TableName: process.env.tableName,
        Item: data,
        ConditionExpression: "vendor_id <> :vi",
        ExpressionAttributeValues: {
            ":vi": data.vendor_id,
        }
    };
    try {
        await dynamoDbLib.call("put", params);
        return success({
            data: params.Item,
            isExecuted: true
        });
    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}