import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require('moment-timezone');
const abbreviate = require('abbreviate');
//const date = new Date();

export async function main(event, context) {

  const data = JSON.parse(event.body);
  //console.log(" Challan challan",data);
  data.orientation = data.orientation;
  data.name = data.name;
  data.customer_id = data.customer_id;
  data.created_at = Date.now();
  data.created_date = moment(data.created_date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
  data.sk = data.customer_id;
  data.created_by= data.created_by;

  if (1) {
    let fromModifiedDate = moment(data.created_date).tz("Asia/Dhaka").format("YYYY-MM-DD");
    let toModifiedDate = moment(data.created_date).tz("Asia/Dhaka").add(+1, "days").format("YYYY-MM-DD");
    let orientation = 'order';

    const param = {
      TableName: process.env.tableName,
      IndexName: "orientation-index",
      KeyConditionExpression: "#orientation = :orientation",
      FilterExpression: "created_date BETWEEN :start and :end",
      ExpressionAttributeNames: {
        '#orientation': 'orientation'
      },
      ExpressionAttributeValues: {
        ":orientation": orientation,
        ":start": fromModifiedDate,
        ":end": toModifiedDate,

      },
      Limit: 100000,
      ScanIndexForward: true,
    };
    const result = await dynamoDbLib.call("query", param);
    console.log(result.Count, "countcountcountcountcountcount");
    let count = parseInt(result.Count);
    data.order_id = `SL-${fromModifiedDate}-${count + 1}`;
    console.log(data.order_id);
    data.pk = data.order_id;
  };
  if (data.sk) {
    let orientation = 'order';
    console.log(data.sk, "sksksksksksksksksk");
    const param2 = {
      TableName: process.env.tableName,
      IndexName: "orientation-index",
      KeyConditionExpression: "#orientation = :orientation and begins_with(#sk, :sk)",
      ExpressionAttributeNames: {
        '#orientation': 'orientation',
        "#sk": 'sk',
      },
      ExpressionAttributeValues: {
        ":orientation": orientation,
        ":sk": data.sk
      },
      Limit: 100000,
      ScanIndexForward: true,
    };
    const result = await dynamoDbLib.call("query", param2);
    let tripCount = 0;
    result.Items.map((trip) => {
      tripCount = tripCount + trip.count;
    });
    let c = tripCount;
    data.truck_details.map((d) => {
      d.trip_number = `${abbreviate(data.name, { length: 4 }).toLowerCase() + '_' + data.orientation.toLowerCase()}-${++c}`;
      c = c;
    });
    console.log(tripCount, "tripCounttripCounttripCounttripCounttripCount");

    console.log(data.truck_type);
  };
  try {
    const params = {
      TableName: process.env.tableName,
      Item: data
    };
    await dynamoDbLib.call("put", params);
    return success({
        data: params.Item,
        isExecuted: true
    });
} catch (e) {
    return failure({ isExecuted: false, error: e });
}
};
