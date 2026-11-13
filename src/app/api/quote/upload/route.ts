/** POST /api/quote/upload — hands the /quote tool a short-lived token so the browser can put the
 *  original photos and videos straight into Vercel Blob (store "rinse-quote-files"). Files go
 *  browser → Blob directly, so a 300 MB walkaround video never passes through this function.
 *  Only an unlocked tool gets a token. The links end up in the GHL contact note. */

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isQuoteAuthed } from "@/app/quote/auth";

export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!(await isQuoteAuthed())) throw new Error("Unlock the tool first.");
        return {
          allowedContentTypes: ["image/*", "video/*"],
          maximumSizeInBytes: 2 * 1024 * 1024 * 1024, // 2 GB: a long 4K walkaround
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {}, // ponytail: the note in GHL is the record; nothing to do here
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 400 });
  }
}
