import { createTRPCRouter } from "./trpc";
import { tripRouter } from "./routers/trip";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  trip: tripRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
