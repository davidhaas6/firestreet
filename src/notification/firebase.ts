import { Link, Store } from '../store/model';
import { Print, logger } from '../logger';
import { config } from '../config';
import * as admin from 'firebase-admin';



// const firebaseConfig = {
//     //TODO: move these to the dotenv file
//     apiKey: "AIzaSyCnGa7tlfHZeSXd_SJcoFyS-_Pr-5FJy1o",
//     authDomain: "restock-a7997.firebaseapp.com",
//     projectId: "restock-a7997",
//     storageBucket: "restock-a7997.appspot.com",
//     messagingSenderId: "143759888462",
//     appId: "1:143759888462:web:cb3d450cac474cac7f331f",
//     measurementId: "G-753WKBDGLW"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

var serviceAccount = require("../../fcmKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});


//   const twitter = config.notifications.twitter;

// const client = new Twitter({
// 	access_token_key: twitter.accessTokenKey,
// 	access_token_secret: twitter.accessTokenSecret,
// 	consumer_key: twitter.consumerKey,
// 	consumer_secret: twitter.consumerSecret
// });

export function sendFirebaseMessage(link: Link, store: Store) {
    logger.debug('↗ sending firebase cloud message');

    // The topic name can be optionally prefixed with "/topics/".
    var priceStr = link.price == null ? '' : 'for $' + link.price.toFixed(0) + ' ';
    var message = {
        notification: {
            //
            title: `${link.series} ${priceStr}- Restocker`,
            body: `${link.brand} ${link.model} ${link.series}`,
            // imageUrl: ``
        },
        data: {
            url: link.cartUrl ?? link.url,
        },

        // options: { // https://firebase.google.com/docs/reference/admin/node/admin.messaging.MessagingOptions
        //     priority: "high",
        //     timeToLive: 120,  // 2 minutes
        // },

        topic: link.series
    };

    // Send a message to devices subscribed to the provided topic.
    return admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            logger.info('Successfully sent message: ' + response);
        })
        .catch((error) => {
            logger.info('Error sending message: ' + error);
        });
}
