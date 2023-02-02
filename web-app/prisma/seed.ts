import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

// load from local file in the same folder

const prisma = new PrismaClient();
async function main() {
  // Get all with the date 2021-01-01
  // const all = await prisma.trip.findMany({
  //   where: {
  //     start_time: new Date("2021-05-01"),
  //   },
  // });
  // console.log(all);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
