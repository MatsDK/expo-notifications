from exponent_server_sdk import ( 
	DeviceNotRegisteredError,
	PushClient,
	PushMessage,
	PushServerError,
	PushTicketError,
)
from requests.exceptions import ConnectionError, HTTPError


def send_push_message(token, message, extra=None):
    try:
        response = PushClient().publish(
            PushMessage(to=token,
	        body=message,
	        data=extra))
    except PushServerError as exc:
        print(exc)
    except (ConnectionError, HTTPError) as exc:
        print("Connection error", exc)

    try:
        response.validate_response()
    except DeviceNotRegisteredError:
        print("device not registered")
    except PushTicketError as exc:
        print("push ticket error")

token = "ExponentPushToken[]" 

send_push_message(token, "message")