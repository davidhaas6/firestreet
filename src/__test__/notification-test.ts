import {Link, Store} from '../store/model';
import {sendNotification} from '../notification';

const link: Link = {
	brand: 'test:brand',
	cartUrl: 'https://www.example.com/cartUrl',
	model: 'test:model',
	price: 100,
	series: '3060ti',
	url: 'https://www.example.com/url'
};

const store: Store = {
	currency: '',
	labels: {
		inStock: {
			container: 'test:container',
			text: ['test:text']
		}
	},
	links: [link],
	name: 'test:name'
};

/**
 * Send test email.
 */
var firebasePromise = sendNotification(link, store);
firebasePromise.then(function() {
    console.log("finished notification test. exiting...");

    process.exit(0);
  })
  .catch(function(error) {
    console.log("Transactions failed:", error);
    process.exit(1);
  });