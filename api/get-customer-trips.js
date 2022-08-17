import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

  let query = event.queryStringParameters;
  var customer_id = query.id;
  const params = {
    TableName: process.env.tableName,
    IndexName: "orientation-index",
    KeyConditionExpression: "#orientation = :orientation",

    ExpressionAttributeNames: {
        "#orientation": "orientation",
        "#customer_id" :"customer_id",

    },

    ExpressionAttributeValues: {
        ":orientation": "trip",
        ":customer_id": customer_id,
      },
      FilterExpression: "begins_with(#customer_id, :customer_id)",

  };


  try {

    var result = await dynamoDbLib.call("query", params);
    console.log(result.Items, "thisssssss");
    if (result.LastEvaluatedKey) {
        params.ExclusiveStartKey = result.LastEvaluatedKey;
        result = await dynamoDbLib.call("query", params);
    }
    return success({
        data: result.Items,
        isExecuted: true
    });
} catch (e) {
    return failure({ isExecuted: false, error: e });
}

}
