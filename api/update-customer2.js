import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
const date = Date.now();
const moment = require('moment-timezone');
export async function main(event, context) {
    const data = JSON.parse(event.body);
    data.updated_date= moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    data.updated_by= data.updated_by;
    // data.updated_date = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    //let orientation = query && query.orientation ? query.orientation : 'order';
    // let customer_id = query && query.customer_id ? query.customer_id : '';
    console.log("============customer_id   StringParameters==============", data.customer_id);
    //console.log("============to2   StringParameters==============", toModifiedDate);
    var params;
    try {
         params = {
            TableName: process.env.tableName,
            Key: {
                pk: data.pk,
                sk: data.sk
            },
            ConditionExpression: "customer_id = :ci",
            UpdateExpression: "SET  #name = :name, #type = :type, #phone = :phone, #updated_by= :updated_by, #updated_date= :updated_date, #customerCornPersonName= :customerCornPersonName, #customerCornPersonPhone= :customerCornPersonPhone ",
            ExpressionAttributeNames: {
                "#name": 'name',
                "#type": 'type',
                "#phone": 'phone',
                "#updated_by": 'updated_by',
                "#updated_date": 'updated_date',
                "#customerCornPersonName": 'customerCornPersonName',
                "#customerCornPersonPhone": 'customerCornPersonPhone'

            },
            ExpressionAttributeValues: {
               ":ci":    data.customer_id,
                ":name": data.name,
                ":phone": data.phone,
                ":type": data.type,
                ":updated_date": data.updated_date,
                ":updated_by": data.updated_by,
                ":customerCornPersonPhone": data.customerCornPersonPhone,
                ":customerCornPersonName": data.customerCornPersonName
                // ":updated_by": data.updated_by
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
