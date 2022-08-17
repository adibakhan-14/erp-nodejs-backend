import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const abbreviate = require('abbreviate');
const moment = require("moment-timezone");
const date = new Date();

export async function main(event, context) {

  const data = JSON.parse(event.body);
  // const util = require('./utils');

  data.orientation = data.orientation;
  let created_at = Date.now();
  let created_date = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
  let customer_id = data.phone + '_' + abbreviate(data.name, { length: 4 }).toLowerCase() + '_' + data.orientation.toLowerCase();

  let params = {
    TransactItems: [{
      Put: {
        TableName: process.env.tableName,
        Item: {
          // data.app_user_name = util.getUserName(event.headers);
          // data.app_user_id = util.getUserId(event.headers);
          orientation: data.orientation,
          name: data.name,
          email: data.email,
          type: data.type,
          phone: data.phone,
          created_at: created_at,
          created_date : created_date,
          customer_id : customer_id,
          pk: customer_id,
          sk: data.type,
          picture_name: data.picture_name
        },

        ConditionExpression: "customer_id <> :ci",
        ExpressionAttributeValues: {
          ":ci": customer_id
        }
      }
    }, {
      Put: {
        TableName: process.env.tableName,
        Item: {
          // data.app_user_name = util.getUserName(event.headers);
          // data.app_user_id = util.getUserId(event.headers);
          orientation: "employee",
          name: data.name,
          email: data.email,
          phone: data.phone,
          created_at: created_at,
          created_date : created_date,
          customer_id : customer_id,
          pk: data.email,
          sk: customer_id,
        },
        ConditionExpression: "email <> :email",
        ExpressionAttributeValues: {
          ":email": data.email
        }
      }
    }]
  };
  try {
    await dynamoDbLib.call("transactWrite", params);
    return success({
      data: params.TransactItems[0].Put.Item,
      isExecuted: true,
    });
  } catch (e) {
    return failure({ isExecuted: false, error: e });
  }
}