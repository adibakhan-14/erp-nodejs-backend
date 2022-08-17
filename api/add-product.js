import moment from "moment";
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const date = new Date();

export async function main(event) {


    const data = JSON.parse(event.body);
    data.orientation = data.orientation;
    data.productName = data.productName;
    data.remarks = data.remarks;
    data.created_at = Date.now();
    data.created_date = moment(date).format("YYYY-MM-DD:mm:ss");
    data.final_date = (data.created_date).split("-").join("");
    data.product_id = 'sl' + (data.final_date).split(":").join("");
    console.log(data.product_id, "laaaaaaaaaaa");

    data.pk = data.product_id;
    data.sk = data.orientation;

    const params = {
        TableName: process.env.tableName,
        Item: data,
        ConditionExpression: "product_id <> :pi",
        ExpressionAttributeValues: {
            ":pi": data.product_id,
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