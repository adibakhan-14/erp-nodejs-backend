import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  data.pk = data.pk;
  data.sk = data.sk;

  const params = {
    TableName: process.env.tableName,
    Item: data,
    ConditionExpression: '#pk = :pk AND #sk = :sk ',
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk'
    },
    ExpressionAttributeValues: {
      ":pk": data.pk,
      ":sk": data.sk
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success({
      data: params.Item,
      isExecuted: true
    });
  } catch (e) {
    return failure({ status: false, error: e });
  }
}
