var AWS = require('aws-sdk');
export function main(event, context, callback) {
    console.log("eventttttt", event);
    //  const data = JSON.parse(event.body);
    // console.log("datttttttaaa", data);
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

    var params = {
        GroupName: 'Admin', //your confirmed user gets added to this group
        UserPoolId: event.userPoolId,
        Username: 'adibasumaiya.27@gmail.com'
    };

    console.log("param", params);
    cognitoidentityserviceprovider.adminAddUserToGroup(params)
        .promise()
        .then(res => callback(null, event))
        .catch(err => callback(err, event));

};

// cognitoIdentityServiceProvider
//     .adminAddUserToGroup(params)
//     .promise()
//     .then((data) => console.log(data, "lambda trigerrrrrr"))
//     .catch(err => console.log(err));
// cognitoidentityserviceprovider.adminAddUserToGroup(params, function(err, data) {
//     if (err) {
//         callback(err); // an error occurred
//     }
//     callback(null, event); // successful response
// });


// add-to-group.js
/* eslint-disable-line */
//  var AWS = require('aws-sdk');
//  module.exports.addUserToGroup = (event, context, callback) => {

// var params = {
//     GroupName: 'Admin', //your confirmed user gets added to this group
//     UserPoolId: "ap-southeast-1_MYZcWr051",
//     Username: "juthisarker80@gmail.com"
// };
// //     //some minimal checks to make sure the user was properly confirmed
// //     if (event.request.userAttributes["custom:groupName"])
// //         callback("User was not properly confirmed and/or email not verified");
//     cognitoidentityserviceprovider.adminAddUserToGroup(params, function(err, data) {
//         if (err) {
//             callback(err); // an error occurred
//         }
//         callback(null, event); // successful response
//     });
// };


// export function afterConfirmationTrigger(event, context, callback) {
//     const params = {
//       GroupName: "Owners",
//       UserPoolId: event.userPoolId,
//       Username: event.userName
//     };

//     CognitoIdentityServiceProvider.adminAddUserToGroup(params)
//       .promise()
//       .then(res => callback(null, event))
//       .catch(err => callback(err, event));
//   }