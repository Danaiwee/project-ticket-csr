import fs from "fs";
import path from "path";
import csv from "csv-parser";

import { fileURLToPath } from "url";
import { prisma } from "../src/lib/prisma.js";

const __filename = fileURLToPath(import.meta.url); //file:///D:/project/seed.ts >> D:\project\seed.ts 
const __dirname = path.dirname(__filename); // >> find the folder D:\project\seed.ts >> D:\project

async function syncData() {
  const filePath = path.join(__dirname, "../data/locations.csv"); // target data from this file
  const results: any[] = [];

  fs.createReadStream(filePath, { encoding: "utf-8" })
    .pipe(
      csv({
        // 💡 1. skip first row
        skipLines: 1,
        // 💡 2. change headers to Eng
        headers: [
          "index",
          "name",
          "typeNum",
          "typeName",
          "sub",
          "dist",
          "prov",
          "reg",
          "lat",
          "long",
          "imp",
          "details",
        ],
      })
    )
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      console.log(`Importing ${results.length} lists...`);

      // Clear database
      await prisma.location.deleteMany({});

      for (const row of results) {
        try {
          // 💡 Insert data with according to Eng headers
          await prisma.location.upsert({
            where: { name: row.name.trim() },
            update: {},
            create: {
              item: parseInt(row.index) || 0,
              name: row.name.trim(),
              typeNumber: parseInt(row.typeNum) || 0,
              typeName: row.typeName || "",
              subdistrict: row.sub,
              district: row.dist,
              province: row.prov,
              region: row.reg,
              latitude: parseFloat(row.lat) || 0,
              longitude: parseFloat(row.long) || 0,
              importance: row.imp,
              details: row.details,
              limitBooking: 10,
            },
          });
        } catch (error) {
          console.error(`Error Field: ${row.name}`, error.message);
        }
      }
      console.log("✅ Import successfully!");
      await prisma.$disconnect();
    });
}

syncData();
