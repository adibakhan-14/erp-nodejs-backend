import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require("moment-timezone");
const date = Date.now();

export async function main(event, context) {

    let today = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
    let yesterday = moment(date).tz("Asia/Dhaka").add(-1, "days").format("YYYY-MM-DDThh:mm:ss");
    let thisWeek = moment(date).tz("Asia/Dhaka").add(-7, "days").format("YYYY-MM-DDThh:mm:ss");
    let lastMonth = moment(date).tz("Asia/Dhaka").add(-30, "days").format("YYYY-MM-DDThh:mm:ss");

    let targets = [today, yesterday, thisWeek, lastMonth];

    let seriesname = ["individual", "sme", "corporate"];
    let series = ["Individual", "SME", "Corporate"];

    var params;
    var individual = [];
    var sme = [];
    var corporate = [];

    try {

        for (var e = 0; e < seriesname.length; e++) {

            for (var element = 0; element < targets.length - 1; element++) {

                params = {
                    TableName: process.env.tableName,
                    IndexName: "status-index",
                    KeyConditionExpression: "#status = :status AND #created_date BETWEEN :start AND :end",
                    ExpressionAttributeNames: {
                        "#status": "status",
                        "#created_date": "created_date",
                        "#type": "customer_type"
                    },
                    ExpressionAttributeValues: {
                        ":status": "consignmentDone",
                        ":start": targets[element + 1],
                        ":end": targets[element],
                        ":type": seriesname[e]
                    },
                    //Select: "COUNT",
                    FilterExpression: "begins_with(#type, :type)",
                    ScanIndexForward: false
                };

                var result = await dynamoDbLib.call("query", params);
                var count = 0;
            //    var count = result.Count;
                while (result.LastEvaluatedKey) {
                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                    result = await dynamoDbLib.call("query", params);
                   // count += result.Count;
                }
                result.Items.forEach(element => {
                  count = count + parseInt(element.number_of_consignment);
                });

                if (seriesname[e] === "individual") {
                    individual.push({ value: count.toString() });

                } else if (seriesname[e] === "sme") {
                    sme.push({ value: count.toString() });

                } else {
                    corporate.push({ value: count.toString() });

                }

              //  count = null;
                result = null;

            };

        }
        console.log("==========sme=========",sme);
        console.log("==========sme=========",corporate);
        return success({
            data: [
                {
                    seriesname: series[0],
                    data: individual,
                },
                {
                    seriesname: series[1],
                    data: sme
                },
                {
                    seriesname: series[2],
                    data: corporate
                }
            ],
            isExecuted: true
        });

    } catch (e) {
        return failure({ isExecuted: false, error: e });
    }
}
