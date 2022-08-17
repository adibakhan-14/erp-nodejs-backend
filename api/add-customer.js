import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
const moment = require("moment-timezone");
const abbreviate = require('abbreviate');
const date = new Date();

export async function main(event, context) {
    const data = JSON.parse(event.body);
    data.orientation = data.orientation;
    data.created_at = Date.now();
    data.created_date = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    let customer_id = data.phone + '_' + abbreviate(data.name, { length: 4 }).toLowerCase() + '_' + data.orientation.toLowerCase();
    data.sk = customer_id;
    //data.sk = data.trade_license_no;
    data.pk = data.email;
    data.trade_license_no = data.trade_license_no;
    data.customer_id = customer_id;
    data.name = data.name;
    data.email = data.email;
    data.type = data.type;
    data.phone = data.phone;
    data.designation = data.designation;
    data.address = data.address;
    data.responsible_person_name = data.responsible_person_name;
    data.designation = data.designation;
    data.employee_ID = data.employee_ID;
    data.company_logo_ID = data.company_logo_ID;
    data.agreement_paper_ID = data.agreement_paper_ID;
    data.trade_license_ID = data.trade_license_ID;
    data.authorization_letter_ID = data.authorization_letter_ID;
    data.created_by= data.created_by;
    data.updated_by= data.updated_by;
    data.updated_date= data.updated_date;
    data.customerCornPersonName= data.customerCornPersonName;
    data.customerCornPersonPhone = data.customerCornPersonPhone;
    try {
        let params = {
            TableName: process.env.tableName,
            Item: data,
            ConditionExpression: "customer_id <> :ci",
            ExpressionAttributeValues: {
                ":ci": customer_id
            }
        };
        console.log(params, "cutomer details");
        await dynamoDbLib.call("put", params);
        return success({
            data: params.Item,
            isExecuted: true
        });
    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}