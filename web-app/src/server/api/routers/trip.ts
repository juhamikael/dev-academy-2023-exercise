import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

// export const tripRouter = createTRPCRouter({
//   getAll: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.trip.findMany({
//       where: {
//         start_time: {
//           gt: new Date("2021-05-01T00:00:11.000Z"),
//           lt: new Date("2021-05-02T00:00:11.000Z"),
//         },
//       },
//     });
//   }),
// });

export const tripRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(({ ctx, input }) => {
      const start_time = new Date(`${input.date}T00:00:11.000Z`);
      const end_time = new Date(`${input.date}T23:59:59.999Z`);
      return ctx.prisma.trip.findMany({
        where: {
          start_time: {
            gt: start_time,
            lt: end_time,
            // gt: new Date("2021-05-01T00:00:11.000Z"),
            // lt: new Date("2021-05-02T00:00:11.000Z"),
          },
        },
      });
    }),
});
