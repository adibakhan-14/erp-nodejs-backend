import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
const moment = require('moment-timezone');
const date = new Date();


export async function main(event) {
    const data = JSON.parse(event.body);
    let orientation = 'trip';
    data.orientation = data.orientation;
    const param2 = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
        },
        // Select: "COUNT",
        //Limit: 100000,
        ScanIndexForward: true,
      };
      const result = await dynamoDbLib.call("query", param2);
    //   let tripCount = 0;
      var count = parseInt(result.Count);
      console.log(count);

      data.trip_id= `${data.order_id}-${data.name.toLowerCase().slice(0,4)}-${count + 1}`;
      data.created_at= Date.now();
      data.created_date =  moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
      data.pk = data.trip_id;
      data.sk= data.order_id;
      data.truck_details= data.truck_details;
      data.trip_number=`Trip-${count + 1}`;
      data.status = 'ordersPlaced';

      const params = {
        TableName: process.env.tableName,
        Item: data,
        ConditionExpression: "trip_id <> :ti",
        ExpressionAttributeValues: {
            ":ti": data.trip_id,
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