// import { kafka } from '@packages/utils/kafka';
// import { updateUserAnalytics } from './services/analatics.service';

// /* =======================
//    Types
// ======================= */

// type UserEventAction =
//   | 'add_to_wishlist'
//   | 'add_to_cart'
//   | 'product_view'
//   | 'remove_from_wishlist'
//   | 'remove_from_cart'
//   | 'shop_visit';

// export interface UserEvent {
//   userId?: string;
//   productId?: string;
//   shopId?: string;
//   action: UserEventAction;
//   country?: string;
//   city?: string;
//   latitude?: number;
//   longitude?: number;
// }


// /* =======================
//    Constants & State
// ======================= */

// const consumer = kafka.consumer({ groupId: 'user-events-group' });

// const eventQueue: UserEvent[] = [];

// const validActions: UserEventAction[] = [
//   'add_to_wishlist',
//   'add_to_cart',
//   'product_view',
//   'remove_from_wishlist',
//   'remove_from_cart',
// ];

// /* =======================
//    Queue Processor
// ======================= */

// const processQueue = async (): Promise<void> => {
//   if (eventQueue.length === 0) return;

//   const events = [...eventQueue];
//   eventQueue.length = 0;

//   for (const event of events) {
//     if (!event.action || !validActions.includes(event.action)) {
//       continue;
//     }

//     if (event.action === 'shop_visit') {
//       console.log(event);
//     }

//     try {
//       await updateUserAnalytics(event);
//     } catch (error) {
//       console.error(error);
//     }
//   }
// };

// /* =======================
//    Kafka Consumer
// ======================= */

// const consumeKafkaMessages = async (): Promise<void> => {
//   await consumer.connect();

//   await consumer.subscribe({
//     topic: 'users-events',
//     fromBeginning: true,
//   });

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       if (!message?.value) return;

//       const event: UserEvent = JSON.parse(message.value.toString());
//       eventQueue.push(event);
//     },
//   });
// };

// /* =======================
//    Bootstrap
// ======================= */

// setInterval(() => {
//   processQueue().catch(console.error);
// }, 3000);

// consumeKafkaMessages().catch(console.error);


import { kafka } from '@packages/utils/kafka';
import { updateUserAnalytics, updateProductAnalytics } from './services/analatics.service';

type UserEventAction =
  | 'add_to_wishlist'
  | 'add_to_cart'
  | 'product_view'
  | 'remove_from_wishlist'
  | 'remove_from_cart'
  | 'shop_visit'
  | 'decrease_cart_quantity'
  | 'clear_cart'
  | 'purchase'; // include all actions you plan to track

interface UserEvent {
  userId?: string;
  productId?: string;
  shopId?: string;
  action: UserEventAction;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

const consumer = kafka.consumer({ groupId: 'user-events-group' });

const eventQueue: UserEvent[] = [];
let eventsProcessed = 0;

// Queue processor
async function processQueue() {
  if (!eventQueue.length) return;
  const events = [...eventQueue];
  eventQueue.length = 0;

  for (const event of events) {
    try {
      console.log('[QUEUE] Processing event:', event);
      await updateUserAnalytics(event);

      if (event.productId && event.productId !== 'ALL') {
        await updateProductAnalytics(event);
      }

      eventsProcessed++;
      console.log('[QUEUE] Event processed successfully:', event.action);
    } catch (err) {
      console.error('[QUEUE] Failed to process event:', event, err);
    }
  }
}

// Kafka consumer
async function startConsumer() {
  try {
    console.log('[KAFKA] Connecting consumer...');
    await consumer.connect();
    console.log('[KAFKA] Connected');

    await consumer.subscribe({ topic: 'users-events', fromBeginning: true });
    console.log('[KAFKA] Subscribed to topic users-events');

    await consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;

        try {
          const event: UserEvent = JSON.parse(message.value.toString());
          eventQueue.push(event);
        } catch (err) {
          console.error('[KAFKA] Failed to parse message:', message.value?.toString(), err);
        }
      },
    });

  } catch (err) {
    console.error('[KAFKA] Consumer failed:', err);
    process.exit(1);
  }
}

// Run queue processor every 2 seconds
setInterval(() => {
  processQueue().catch(console.error);
}, 2000);

// Start consumer
startConsumer();
