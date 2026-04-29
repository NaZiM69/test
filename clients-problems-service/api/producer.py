import pika
import json

def send_notification(data):
    try:
        # Default RabbitMQ connection (localhost)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
        channel = connection.channel()

        # Declare the queue
        channel.queue_declare(queue='problem_notifications')

        # Publish the message
        channel.basic_publish(
            exchange='',
            routing_key='problem_notifications',
            body=json.dumps(data)
        )
        connection.close()
        print(f" [x] Sent notification for problem {data.get('id')}")
    except Exception as e:
        print(f" [!] Could not send notification to RabbitMQ: {e}")
