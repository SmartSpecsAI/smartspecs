import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

const DIFY_API_URL = process.env.DIFY_API_URL;
const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DEFAULT_WORKFLOW_ID = process.env.DIFY_WORKFLOW_ID;

export async function POST(req: Request) {
  try {
    if (!DIFY_API_KEY) {
      return NextResponse.json({ error: "Falta DIFY_API_KEY" }, { status: 500 });
    }
    if (!DIFY_API_URL) {
      return NextResponse.json({ error: "Falta DIFY_API_URL" }, { status: 500 });
    }

    const { inputs = {}, user = "57Blocks", workflow_id } = await req.json();

    const { data, status } = await axios.post(
      DIFY_API_URL,
      { inputs, user, workflow_id: workflow_id ?? DEFAULT_WORKFLOW_ID },
      { headers: { Authorization: `Bearer ${DIFY_API_KEY}` } }
    );

    return NextResponse.json(data, { status });
  } catch (err) {
    const error = err as AxiosError;
    console.error("Dify Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message, details: error.response?.data },
      { status: error.response?.status || 500 }
    );
  }
}