import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const JSON_PATH = path.join(process.cwd(), "pledges.json");

interface Pledge {
  amount: number;
  [key: string]: any;
}

export async function GET() {
  let pledges: Pledge[] = [];
  if (fs.existsSync(JSON_PATH)) {
    pledges = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  }
  // Sort by amount descending
  pledges.sort((a: Pledge, b: Pledge) => b.amount - a.amount);
  return NextResponse.json(pledges);
}