import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'kafka-service',
  brokers: process.env.BROKERS!.split(','),
  ssl: true,
  sasl: {
    mechanism: 'plain', // or 'scram-sha-256'
    username: process.env.KAFKA_API_KEY!,
    password: process.env.KAFKA_API_SECRET!,
  },
});
