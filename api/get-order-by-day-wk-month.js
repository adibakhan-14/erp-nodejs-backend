import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require("moment-timezone");
const date = Date.now();
export async function main(event, context) {

    let query = event.queryStringParameters;
    let time = query && query.time ? query.time : "";
    let today = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    let yesterday = moment(date).tz("Asia/Dhaka").add(-1, "days").format("YYYY-MM-DDThh:mm:ss");
    let thisWeek = moment(date).tz("Asia/Dhaka").add(-7, "days").format("YYYY-MM-DDThh:mm:ss");
    let lastMonth = moment(date).tz("Asia/Dhaka").add(-30, "days").format("YYYY-MM-DDThh:mm:ss");

   // let targets = [today, yesterday, thisWeek, lastMonth];

    // let seriesname = ["individual", "sme", "corporate"];
    // let series = ["Individual", "SME", "Corporate"];
    console.log("======================yesterday====================", yesterday);
    console.log("=====================today===================", today);
    console.log("===============last Month=============", lastMonth);
    var params;
    var result;
   // var count;
    try {

        if (time === "today") {

            // for (var element = 0; element < targets.length - 1; element++) {
            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status AND #created_date BETWEEN :start AND :end",
                ExpressionAttributeNames: {
                    "#status": "status",
                    "#created_date": "created_date",
                },
                ExpressionAttributeValues: {
                    ":status": "consignmentDone",
                    ":start": today,
                    ":end": yesterday,

                },
                //   Select: "COUNT",
                // FilterExpression: "begins_with(#type, :type)",
                ScanIndexForward: false
            };

            result = await dynamoDbLib.call("query", params);
         //   count = result.Count;
            //  console.log("======================query===================result===============", result);
            while (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                result = await dynamoDbLib.call("query", params);
               // count += result.Count;
            }
            // count = null;
            // result = null;

            // }
        }

        else if (time === "lastWeek") {

            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status AND #created_date BETWEEN :start AND :end",
                ExpressionAttributeNames: {
                    "#status": "status",
                    "#created_date": "created_date",
                },
                ExpressionAttributeValues: {
                    ":status": "consignmentDone",
                    ":start": yesterday,
                    ":end": thisWeek,
                },

                ScanIndexForward: false
            };
            result = await dynamoDbLib.call("query", params);
            // count = result.Count;
            while (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                result = await dynamoDbLib.call("query", params);
               // count += result.Count;
            }
        }
        else if (time === "lastMonth") {

            params = {
                TableName: process.env.tableName,
                IndexName: "status-index",
                KeyConditionExpression: "#status = :status AND #created_date BETWEEN :start AND :end",
                ExpressionAttributeNames: {
                    "#status": "status",
                    "#created_date": "created_date",
                },
                ExpressionAttributeValues: {
                    ":status": "consignmentDone",
                    ":start": thisWeek,
                    ":end": lastMonth,
                },

                ScanIndexForward: false
            };
            result = await dynamoDbLib.call("query", params);
             //count = result.Count;
            while (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                result = await dynamoDbLib.call("query", params);
               // count += result.Count;
            }


        }

     console.log("===================resultttttttt======result.Items===================", result.Items);
        return success({
            data: result.Items,

            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}
