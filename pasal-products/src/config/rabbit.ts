export const config = {
    "vhosts": {
      "test": {
        "connection": {
         "url": "amqp://rabbitmq-srv:5672"
          },
           "exchanges": {
              "test_exchange": {
                 "assert": true,
                 "type": "direct"
              }
           },
           "queues": [
              "test_queue"
           ],
           "bindings": {
              "b1": {
                 "source": "test_exchange",
                 "destination": "test_queue",
                 "destinationType": "queue",
                 "bindingKey": "test_route"
              }
           },
           "publications": {
              "product:created": {
                 "vhost": "test",
                 "exchange": "test_exchange",
                 "routingKey": "test_route"
              }
           },
           "subscriptions": {
              "product:created": {
                 "queue": "test_queue",
                 "prefetch": 1
              }
           }
        }
     }
};