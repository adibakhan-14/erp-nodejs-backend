import { success, failure } from "../libs/response-lib";
import * as dynamoDbLib from "../libs/dynamodb-lib";
const moment = require('moment-timezone');
const date = new Date();

//const AWS = require('aws-sdk');
//const dbb = new AWS.DynamoDB.DocumentClient();
// AWS.config.update({region: 'ap-southeast-1'});

// Create DynamoDB service object

export async function main(event, context) {
    const data = JSON.parse(event.body);

    let orientation = 'trip';
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
      console.log(result.Count, "countcountcountcountcountcount");


      console.log(result, "result ki pacchi");

    try {
        let increasevar =1;
        data.forEach(e => {
            const id = `${e.order_id}-${e.name.toLowerCase().slice(0,4)}-${count + increasevar}`;
            e["trip_id"] = id;
            e["created_at"] = Date.now();
            e["created_date"] = moment(date).tz("Asia/Dhaka").format("YYYY-MM-DDThh:mm:ss");
            e["pk"] = e.trip_id;
            e["sk"] = e.order_id;
            e["trip_number"]=`Trip-${count + increasevar}`;
            increasevar=increasevar+1;
        });

        console.log(data, "am i getting the correct data???");
        for (let i = 0; i < data.length; i++) {

            // params = '{"RequestItems": {"' + table + '": []}}';
            // params = JSON.parse(params);
            // params.RequestItems[table] = batches[x];
            var params = {
                TableName: process.env.tableName,
                Item: data[i]

            };
            console.log(params, "ki param pacchiiiiii????");
            await dynamoDbLib.call("put", params);
            //   var dbb1= dbb.put(params);
        }
        return success({
            data: data,
            isExecuted: true
        });

    }


    catch (error) {
        return failure({ isExecuted: false, error: error });
    }
}
    // try {
    //     await dynamoDbLib.call("put", params);
    //     return success({
    //         data: params.Item,
    //         isExecuted: true
    //     });
    // } catch (error) {
    //     return failure({ isExecuted: false, error: error });
    // }
    // return await dbb1.promise((response) => {
    //     if (response !== undefined && response.Count > 0) {
    //         return {
    //           statusCode: 200,
    //           body: JSON.stringify(response),
    //         };
    //       } else {
    //         return {
    //           statusCode: 200,
    //           body: '{}',
    //         };
    //       }
    // });
