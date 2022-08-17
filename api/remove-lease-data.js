import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
    let query = event.queryStringParameters;
    let pk = query && query.pk;
    let sk = query && query.sk;
    console.log("======pk====sk=======", pk, sk);
      let removeTruckData = [];
      let indexsToRemove=[];
    var result1;
     var paramsToDelete;
    var paramsToGet;

    try {
        // const data = JSON.parse(event.body);
        paramsToGet = {
            TableName: process.env.tableName,
            Key: {
                pk: pk,
                sk: sk
            },
        };
      //  console.log("===key====",paramsToGet.Key);
        result1 = await dynamoDbLib.call("get", paramsToGet);
        //console.log("====jkkjzjkl====", paramsToGet);
        //console.log("=======reslut1======= ", result1);
        console.log("=======reslut1==information===== ", result1.Item.information);

         removeTruckData = [];
        for (var i = 0; i < result1.Item.information.length; i++) {
            for (var j = 0; j < result1.Item.information.length; j++) {
                if (i !== j) {
                    if (result1.Item.information[i].truck_loading_date === result1.Item.information[j].truck_loading_date &&
                        result1.Item.information[i].truck_starting_date === result1.Item.information[j].truck_starting_date &&
                        result1.Item.information[i].truck_unloading_point === result1.Item.information[j].truck_unloading_point &&
                        result1.Item.information[i].truck_loading_point === result1.Item.information[j].truck_loading_point) {
                            console.log(
                            result1.Item.information[i],
                            '=======leaseObject_SANDIL AZAD========',
                            result1.Item.information[j]
                        );
                        if(!("trip_id" in result1.Item.information[i]  && "truck_reg" in result1.Item.information[i])){
                            console.log("jk==============================================");
                            console.log("----index to remove",i);
                             indexsToRemove.push(i);
                        removeTruckData.push(result1.Item.information[i]);

                        }
                        break;
                    }
                }
            }
        }
        console.log("--===lenth=====",removeTruckData);

        console.log("----index to remove=====---",indexsToRemove);
        let c=0;
         for (var e = 0; e < indexsToRemove.length; e++) {
            console.log("=========e lockding======",indexsToRemove[e]);
            console.log("=========e lockding======",result1.Item.information[indexsToRemove[e]]);
            paramsToDelete = {
                TableName: process.env.tableName,
                Key: {
                    pk: pk,
                    sk: sk
                },
             //   UpdateExpression: `REMOVE information[${indexsToRemove[e]}]`,
                UpdateExpression: "REMOVE information["+indexsToRemove[0]+ "]",
                // ConditionExpression: `removeTruckData[${e}] = :valueToRemove`,
                // ExpressionAttributeValues: {
                //     ":valueToRemove": removeTruckData[e].truck_loading_date
                // }
            };

            await dynamoDbLib.call("update", paramsToDelete);
            c++;
            console.log("===========please =====to c",c);

       }
        return success({
            isExecuted: true
        });
    } catch (e) {
        return failure({ status: false, error: e });
    }
}