const config = {
  vhosts: {
    test: {
      connection: {
        url: "amqp://user:pwd@127.0.0.1:5672/test",
      },
      exchanges: {
        test_exchange: {
          assert: true,
          type: "direct",
        },
      },
      queues: ["test_queue"],
      bindings: {
        b1: {
          source: "test_exchange",
          destination: "test_queue",
          destinationType: "queue",
          bindingKey: "test_route",
        },
      },
      publications: {
        demo_publication: {
          vhost: "test",
          exchange: "test_exchange",
          routingKey: "test_route",
        },
      },
      subscriptions: {
        demo_subscription: {
          queue: "test_queue",
          prefetch: 1,
        },
      },
    },
  },
};

config.vhosts.test.connection.url = "hello";

console.log(config.vhosts.test);
