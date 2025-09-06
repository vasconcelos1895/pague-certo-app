import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { bankRouter } from "./routers/bank";
import { operationRouter } from "./routers/operation";
import { recoveryTypeRouter } from "./routers/recoveryType";
import { provisionForIncurredLosseRouter } from "./routers/provisionForIncurredLosse";
import { additionalProvisionLevelRouter } from "./routers/additionalProvisionLevel";
import { clientRouter } from "./routers/client";
import { addressRouter } from "./routers/address";
import { demandRouter } from "./routers/demand";
import { passiveRestructuringRouter } from "./routers/passiveRestructuring";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  bank: bankRouter,
  operation: operationRouter,
  recoveryType: recoveryTypeRouter,
  provisionForIncurredLosse: provisionForIncurredLosseRouter,
  additionalProvisionLevel: additionalProvisionLevelRouter,
  customer: clientRouter,
  address: addressRouter,
  demand: demandRouter,
  passiveRestructuring: passiveRestructuringRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
