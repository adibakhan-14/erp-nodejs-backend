import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
const date = Date.now();
const moment = require('moment-timezone');

export async function main(event, context) {
    const data = JSON.parse(event.body);
    data.updated_date= moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    data.previous_status= data.previous_status;
    data.updated_by= data.updated_by;
    // let query = event.queryStringParameters;
    // let vendor_id = query && query.vendor_id ? query.vendor_id : '';
    console.log("============driver_id   StringParameters==============", data);
    //console.log("============to2   StringParameters==============", toModifiedDate);
    var params;
    try {
        params = {
            TableName: process.env.tableName,
            Key: {
                pk: data.pk,
                sk: data.sk
            },
            ConditionExpression: "driver_id = :di",
            UpdateExpression: "SET  #name = :name, #phone = :phone, #license_number= :license_number, #nid_number= :nid_number, #updated_by= :updated_by, #updated_date= :updated_date, #previous_status= :previous_status, #status = :status",
            ExpressionAttributeNames: {
                "#name": 'name',
                "#phone": 'phone',
                "#license_number": 'license_number',
                "#nid_number": 'nid_number',
                "#updated_by": 'updated_by',
                "#updated_date": 'updated_date',
                "#previous_status": 'previous_status',
                "#status": 'status'
            },
            ExpressionAttributeValues: {
                ":di": data.pk,
                ":name": data.name,
                ":phone": data.phone,
                ":nid_number": data.nid_number,
                ":license_number": data.license_number,
                ":updated_date": data.updated_date,
                ":updated_by": data.updated_by,
                ":previous_status": data.previous_status,
                ":status": data.status

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