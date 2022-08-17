import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

    let query = event.queryStringParameters;
    let pk = query && query.pk ? query.pk : "";
    let sk = query && query.sk ? query.sk : "";

    const params = {
        TableName: process.env.tableName,

        Key: {
            pk: pk,
            sk: sk
        }
    };

    try {
        await dynamoDbLib.call("delete", params);
        return success({ status: true });
    } catch (e) {
        return failure({ status: false, error: e });
    }
}
