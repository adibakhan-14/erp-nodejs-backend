import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {

  let statusList = ["loadCompleted", "inTransit", "unloadComplete"];

  let query = event.queryStringParameters;
  let limit = query && query.limit ? parseInt(query.limit) : 100;
  let date = query && query.created_date ? query.created_date : "";
  let order_id = query && query.order_id ? query.order_id : "";

  var params;
  var loadCompleted = [];
  var inTransit = [];
  var unloadComplete = [];

  try {

    for (var e = 0; e < statusList.length; e++) {
      if (!date && !order_id) {
        params = {
          TableName: process.env.tableName,
          IndexName: "status-index",
          KeyConditionExpression: "#status = :status",
          ExpressionAttributeNames: {
            '#status': 'status'
          },
          ExpressionAttributeValues: {
            ":status": statusList[e]
          },
          Limit: limit,
          ScanIndexForward: true
        };
      } else if (!date) {
        params = {
          TableName: process.env.tableName,
          IndexName: "status-index",
          KeyConditionExpression: "#status = :status",
          ExpressionAttributeNames: {
            '#status': 'status',
            "#order_id": 'order_id',
          },
          ExpressionAttributeValues: {
            ":status": statusList[e],
            ":order_id": order_id
          },
          FilterExpression: "begins_with(#order_id, :order_id)",
          Limit: limit,
          ScanIndexForward: true
        };
      } else if (!order_id) {
        params = {
          TableName: process.env.tableName,
          IndexName: "status-index",
          KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
          ExpressionAttributeNames: {
            '#status': 'status',
            "#created_date": 'created_date',
          },
          ExpressionAttributeValues: {
            ":status": statusList[e],
            ":created_date": date
          },
          Limit: limit,
          ScanIndexForward: true
        };
      } else {
        params = {
          TableName: process.env.tableName,
          IndexName: "status-index",
          KeyConditionExpression: "#status = :status and begins_with(#created_date, :created_date)",
          ExpressionAttributeNames: {
            '#status': 'status',
            '#created_date': 'created_date',
            '#order_id': 'order_id'
          },
          ExpressionAttributeValues: {
            ":status": statusList[e],
            ':created_date': date,
            ':order_id': order_id,

          },
          FilterExpression: "begins_with(#order_id, :order_id)",
          Limit: limit,
          ScanIndexForward: true
        };
      }

      var result = await dynamoDbLib.call("query", params);

      while (result.LastEvaluatedKey) {
        params.ExclusiveStartKey = result.LastEvaluatedKey;
        result = await dynamoDbLib.call("query", params);
      }
      if (statusList[e] === "loadCompleted") {
        result.Items.forEach(element => {
          loadCompleted.push(element);
        });

      }else if (statusList[e] === "inTransit") {
        result.Items.forEach(element => {
          inTransit.push(element);
        });
      }else {
        result.Items.forEach(element => {
          unloadComplete.push(element);
        });

      }
    };

    return success({
      data: [
        { loadCompleted: loadCompleted },
        { inTransit: inTransit },
        { unloadComplete: unloadComplete }
      ],
      isExecuted: true
    });
  } catch (e) {
    return failure({ isExecuted: false, error: e });
  }
}

