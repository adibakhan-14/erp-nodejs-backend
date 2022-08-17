import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

const moment = require("moment-timezone");
//const date = Date.now();
export async function main(event, context) {

  let query = event.queryStringParameters;
  let orientation = query && query.orientation ? query.orientation : 'trip';
  let limit = query && query.limit ? parseInt(query.limit) : 1000;
  let from = query && query.from ? query.from : "";
  let to = query && query.to ? query.to : "";
  let fromModifiedDate = from ? moment(from).tz("Asia/Dhaka").format("YYYY-MM-DD")+"T00:00:00" : "";
  let toModifiedDate = to ? moment(to).tz("Asia/Dhaka").format("YYYY-MM-DD")+"T23:59:59" : "";
  let sk = query && query.sk ? query.sk : "";
  //let toPreviousDate= moment(toModifiedDate).tz("Asia/Dhaka").add(-1, "days").format("YYYY-MM-DDThh:mm:ss");
  console.log("============from2   queryqueryqueryqueryquery==============", query);

  console.log("============from2   StringParameters==============", fromModifiedDate);
  console.log("============to2   StringParameters==============", toModifiedDate);
  // console.log("============to2   StringParameters==============",to2);
  //let seriesname = ["individual", "sme", "corporate"];
  // var params1;
  // var params2;
  // var result1;
  // var result2;
  var params;
  var result;
  var smeCount=0;
  var individualCount=0;
  var corporateCount=0;
  //var cumulativeSum;
  var customerTypeCount = {
   cumulativeSum:"",
    sme: smeCount.toString(),
    individual: individualCount.toString(),
    corporate: corporateCount.toString(),
    total: 0,
  };
  var count1;
  var count2;
  var count3;
  var totalCount=[];
  try {
    if (!fromModifiedDate && !toModifiedDate && !sk) {
      console.log("=========111111111111111=========");
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation",
        // FilterExpression: "created_date BETWEEN :start and :end",
        ExpressionAttributeNames: {
          '#orientation': 'orientation'
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
        },
        Limit: limit,
        ScanIndexForward: false,
      };
    }
    else if (!sk) {
      console.log("=========22222222222222=========");
      params = {
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
        Limit: limit,
        ScanIndexForward: false,
      };

      // params2 = {
      //   TableName: process.env.tableName,
      //   IndexName: "orientation-index",
      //   KeyConditionExpression: "#orientation = :orientation",
      //   FilterExpression: "contains(#created_date, :created_date)",
      //   ExpressionAttributeNames: {
      //     '#orientation': 'orientation',
      //     '#created_date' : 'created_date'
      //   },
      //   ExpressionAttributeValues: {
      //     ":orientation": orientation,
      //     "created_date": toModifiedDate,
      //   },
      //   Limit: limit,
      //   ScanIndexForward: true,
      // };

    }

    else if (!fromModifiedDate && !toModifiedDate) {
      console.log("=========333333333=========");
     params= {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation and begins_with(#sk, :sk)",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
          "#sk": 'sk',
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
          ":sk": sk
        },
        Limit: limit,
        ScanIndexForward: false,
      };

    }
    else {
      console.log("=========4444444444=========");
      params = {
        TableName: process.env.tableName,
        IndexName: "orientation-index",
        KeyConditionExpression: "#orientation = :orientation and begins_with(#sk, :sk)",
        FilterExpression: "created_date BETWEEN :start and :end",
        ExpressionAttributeNames: {
          '#orientation': 'orientation',
          "#sk": 'sk',
        },
        ExpressionAttributeValues: {
          ":orientation": orientation,
          ":start": fromModifiedDate,
          ":end": toModifiedDate,
          ":sk": sk
        },
        Limit: limit,
        ScanIndexForward: true,
      };
    }

    result = await dynamoDbLib.call("query", params);
   // result2= await dynamoDbLib.call("query", params2);
    //   console.log("========queryyyy======resultt====",result);
    while (result.LastEvaluatedKey) {
      params.ExclusiveStartKey = result.LastEvaluatedKey;
      result= await dynamoDbLib.call("query", params);
     // result2 = await dynamoDbLib.call("query", params2);
    }
    if (!sk) {
      count1 = 0;
      count2=0;
      count3=0;

      for (var e = 0; e < result.Items.length; e++) {

        if (result.Items[e].customer_type === "individual") {
          //  individual.push({ value: count.toString() });
          count1 = count1 + 1;
          customerTypeCount.individual = count1.toString();
          console.log("=========rindividual=========",  customerTypeCount.individual );

        } else if (result.Items[e].customer_type === "sme") {
          count2 = count2 + 1;
          customerTypeCount.sme = count2.toString();
          console.log("=========sme=========",     customerTypeCount.sme );

        } else {
          count3 = count3+ 1;
          customerTypeCount.corporate = count3.toString();
          console.log("=========rcorporate=========",     customerTypeCount);
        }

      }
    }
     // result1.Items.push(customerTypeCount);
     totalCount.push(customerTypeCount);

    // result.Items.push(customerTypeCount);

      // var previousdateOrderCount={
      //   cumulativeSum: fromModifiedDate + toPreviousDate,


      // };
   //   customerTypeCount.cumulativeSum=fromModifiedDate + toPreviousDate;


    return success({
      data: result.Items,
      totalCustomerTypeCount:totalCount,
      isExecuted: true
    });

  } catch (e) {
    return failure({ isExecuted: false, error: e });
  }
}
