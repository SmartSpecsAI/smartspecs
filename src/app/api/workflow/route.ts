import { NextResponse } from "next/server";
import axios from "axios";

const DIFY_API_URL = process.env.DIFY_API_URL ?? "http://localhost/v1/workflows/run";
const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DEFAULT_WORKFLOW_ID = process.env.DIFY_WORKFLOW_ID; // opcional

export async function POST(req: Request) {
  try {
    if (!DIFY_API_KEY) {
      return NextResponse.json({ error: "Falta DIFY_API_KEY" }, { status: 500 });
    }

    const { inputs = {}, user = "frontend-app", workflow_id } = await req.json();

    const { data, status } = await axios.post(
      DIFY_API_URL,
      { inputs, user, workflow_id: workflow_id ?? DEFAULT_WORKFLOW_ID },
      { headers: { Authorization: `Bearer ${DIFY_API_KEY}` } }
    );

    console.log("Dify response:", data);

    return NextResponse.json(data, { status });
  } catch (err: any) {
    console.error("Dify error:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.message, details: err.response?.data },
      { status: err.response?.status || 500 }
    );
  }
}