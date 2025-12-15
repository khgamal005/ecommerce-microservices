import { kafka } from '@packages/utils/kafka';
import { updateUserAnalytics } from './services/analatics.service';

/* =======================
   Types
======================= */

type UserEventAction =
  | 'add_to_wishlist'
  | 'add_to_cart'
  | 'product_view'
  | 'remove_from_wishlist'
  | 'remove_from_cart'
  | 'shop_visit';

export interface UserEvent {
  userId?: string;
  productId?: string;
  shopId?: string;
  action: UserEventAction;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}


/* =======================
   Constants & State
======================= */

const consumer = kafka.consumer({ groupId: 'user-events-group' });

const eventQueue: UserEvent[] = [];

const validActions: UserEventAction[] = [
  'add_to_wishlist',
  'add_to_cart',
  'product_view',
  'remove_from_wishlist',
  'remove_from_cart',
];

/* =======================
   Queue Processor
======================= */

const processQueue = async (): Promise<void> => {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0;

  for (const event of events) {
    if (!event.action || !validActions.includes(event.action)) {
      continue;
    }

    if (event.action === 'shop_visit') {
      console.log(event);
    }

    try {
      await updateUserAnalytics(event);
    } catch (error) {
      console.error(error);
    }
  }
};

/* =======================
   Kafka Consumer
======================= */

const consumeKafkaMessages = async (): Promise<void> => {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'users_events',
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message?.value) return;

      const event: UserEvent = JSON.parse(message.value.toString());
      eventQueue.push(event);
    },
  });
};

/* =======================
   Bootstrap
======================= */

setInterval(() => {
  processQueue().catch(console.error);
}, 3000);

consumeKafkaMessages().catch(console.error);
