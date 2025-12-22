"topic","partition","currentOffset"
"users-events","0","41"
"users-events","1","40"
"users-events","2","44"
"users-events","3","42"
"users-events","4","35"
"users-events","5","42"


[{"timestamp":1766275245820,"timestampType":"CREATE_TIME","partition":5,"offset":39,
"key":null,"value":{"userId":"693611851b089a053975c052",
"productId":"6934e33ab1e0787836e7e203",
"action":"add_to_cart","shopId":"691d35f1d7cdcef7b627db7e","country":"Egypt"
,"city":"Alexandria","device":"desktop - Windows 10 - Chrome 143.0.0.0"},"headers":[]}]

{"level":"INFO","timestamp":"2025-12-22T00:23:20.108Z","logger":"kafkajs",
    "message":"[ConsumerGroup] Consumer has joined the group",
    "groupId":"user-events-group","memberId":"kafka-service-78c1f634-8ff4-4ae9-aa82-43041a1dc7e2",
    "leaderId":"kafka-service-78c1f634-8ff4-4ae9-aa82-43041a1dc7e2","isLeader":true,
    "memberAssignment":{"users-events":[0,1,2,3,4,5]},
"groupProtocol":"RoundRobinAssigner","duration":2633}


{"level":"INFO","timestamp":"2025-12-22T00:23:17.473Z",
    "logger":"kafkajs","message":"[Consumer] St[KAFKA] Subscribed to topic users-events
{"level":"INFO","timestamp":"2025-12-22T00:23:17.473Z","logger":"kafkajs",
    "message":"[Consumer] St[KAFKA] Subscribed to topic users-events

    {"level":"INFO","timestamp":"2025-12-22T00:23:17.473Z","logger":"kafkajs",
    "message":"[Consumer] Starting","groupId":"user-events-group"}