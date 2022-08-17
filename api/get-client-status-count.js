import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require("moment-timezone");
const date = new Date();

export async function main(event, context) {

    let query = event.queryStringParameters;
    let sk = query && query.sk;

    let today = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    let yesterday = moment(date).tz("Asia/Dhaka").add(-1, "days").format("YYYY-MM-DDThh:mm:ss");
    let thisWeek = moment(date).tz("Asia/Dhaka").add(-7, "days").format("YYYY-MM-DDThh:mm:ss");
    let lastMonth = moment(date).tz("Asia/Dhaka").add(-30, "days").format("YYYY-MM-DDThh:mm:ss");

    let targets = [lastMonth, thisWeek, yesterday, today];

    var params;
    var thisDay;
    var pastWeek;
    var pastMonth;

    try {

        for (var element = 0; element < targets.length - 1; element++) {
            params = {
                TableName: process.env.tableName,
                IndexName: "reverse-index",
                KeyConditionExpression: "#sk = :sk",
                ExpressionAttributeNames: {
                    "#sk": "sk",
                    "#status": "status",
                    "#created_date": "created_date"
                },
                ExpressionAttributeValues: {
                    ":sk": sk,
                    ":status": "consignmentDone",
                    ":start": targets[element],
                    ":end": targets[element + 1]
                },
                Select: "COUNT",
                FilterExpression: "#status = :status AND #created_date BETWEEN :start AND :end",
                ScanIndexForward: false
            };

            var result = await dynamoDbLib.call("query", params);
            var count = result.Count;

            while (result.LastEvaluatedKey) {
                params.ExclusiveStartKey = result.LastEvaluatedKey;
                result = await dynamoDbLib.call("query", params);
                count += result.Count;
            }

            if (targets[element] === yesterday) {
                thisDay = count.toString();
            } else if (targets[element] === thisWeek) {
                pastWeek = count.toString();
            } else {
                pastMonth = count.toString();
            }

            count = null;
            result = null;

        };

        return success({
            data: [
                {
                    label: "Today",
                    value: thisDay,
                },
                {
                    label: "Last week",
                    value: pastWeek
                },
                {
                    label: "Last month",
                    value: pastMonth
                }
            ],
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}
