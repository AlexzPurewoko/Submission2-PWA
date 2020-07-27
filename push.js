const webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BGk4pl6GF0j0WufDyl8jksSxFMow8JwvqxiwhrgMcTRkhr1MZbClZdIw5Pb4VuXrp-WblZowvCx5r800-5enkn0",
   "privateKey": "g-sArXF2WelAhWvkZuDGSJC6JUIx5es1CACdfHZlofU"
};
 
 
webPush.setVapidDetails(
   'mailto:purwoko908@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
const pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/f5x7BSIhUMw:APA91bFpDc5A64tzt5Cmb1vh4aBXlH4vu6U9wNcCXbPwTd9o9jLYmnqx16lo6MHV_hHl5QOqHDrceIG3lhMLFDSo0LWSTobapdHd0nJ7LsEbTJI89USsBQJIeQWXEkT6Si01sTF4xLRj",
   "keys": {
       "p256dh": "BOdbsKKCtc7WflZmVcwHYoO9JEWEwUJBqSMPP3w1Gw8WbRGtVpJ2Q3bw0iUmFoiISroA8b/y3MSwLcd8ogpwdLg=",
       "auth": "ah5czR8zCM3PXDDwGjhCsg=="
   }
};
const payload = 'Jangan lupa buka aplikasi Football ya! Ada update terbaru loh :)';
 
const options = {
   gcmAPIKey: '430933313688',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);