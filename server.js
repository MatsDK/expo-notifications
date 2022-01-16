const { Expo } = require("expo-server-sdk")

const messages = []
const pushToken = "ExponentPushToken[]"

let expo = new Expo();

const sendNotification = async ({pushToken, sound, body, data, title}) => {
	if (!Expo.isExpoPushToken(pushToken)) {
		console.error(`Push token ${pushToken} is not a valid Expo push token`);
		return
	}

	messages.push({
		to: pushToken,
		title,
		body,
		data,
		sound,
	})

	let chunks = expo.chunkPushNotifications(messages);
	let tickets = [];

	for (let chunk of chunks) {
		try {
			let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
			console.log(ticketChunk);
			tickets.push(...ticketChunk);
		} catch (error) {
			console.error(error);
		}
	}
}

sendNotification({
	pushToken, 
	sound: "default", 
	title: "This is a title!!!!!!",
	body: "this is message",
	data: { data: "test" }
})