import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
const date = Date.now();
const moment = require('moment-timezone');

export async function main(event, context) {
    const data = JSON.parse(event.body);
    data.updated_date= moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    data.updated_by= data.updated_by;
    console.log("============vendor_id   StringParameters==============", data);
    var params;
    try {
        params = {
            TableName: process.env.tableName,
            Key: {
                pk: data.pk,
                sk: data.sk
            },
            ConditionExpression: "vendor_id = :vi",
            UpdateExpression: "SET  #vendor_name = :vendor_name, #type = :type, #phone = :phone, #email = :email, #updated_by= :updated_by, #updated_date= :updated_date, #concernPersonName= :concernPersonName, #concernPersonPhone = :concernPersonPhone, #trade_license= :trade_license",
            ExpressionAttributeNames: {
                "#vendor_name": 'vendor_name',
                "#type": 'type',
                "#phone": 'phone',
                "#email": 'email',
                "#updated_by": 'updated_by',
                "#updated_date": 'updated_date',
                "#concernPersonPhone": 'concernPersonPhone',
                "#concernPersonName": 'concernPersonName',
                "#trade_license": 'trade_license'
            },
            ExpressionAttributeValues: {
                ":vi": data.pk,
                ":vendor_name": data.vendor_name,
                ":phone": data.phone,
                ":type": data.type,
                ":email": data.email,
                ":updated_date": data.updated_date,
                ":updated_by": data.updated_by,
                ":concernPersonName": data.concernPersonName,
                ":concernPersonPhone": data.concernPersonPhone,
                ":trade_license": data.trade_license
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