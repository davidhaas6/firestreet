import { Link, Store } from '../store/model';
import { Print, logger } from '../logger';
// import { config } from '../config';
import * as admin from 'firebase-admin';


var serviceAccount = require("../../fcmKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});


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
