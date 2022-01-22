import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default () => {
  const [notification, setNotification] = useState<any>(false);
  const [token, setToken] = useState<string | null>(null);

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token != null && setToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Token: {token} </Text>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () =>
          await schedulePushNotification({
            title: "Title",
            body: "Message",
            data: { data: "data" }
          })
        }
      />
    </View>
  );
}

interface NotificationData {
  title: string
  body: string
  data: any
}

const schedulePushNotification = async ({ title, body, data }: NotificationData) =>
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: { seconds: 1 }
  });


const registerForPushNotificationsAsync = async () => {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') finalStatus = (await Notifications.requestPermissionsAsync()).status

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    console.log(token);
  } else alert('Must use physical device for Push Notifications');

  if (Platform.OS === 'android')
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });

  return token;
}