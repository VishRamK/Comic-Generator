import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("Running the model...");
    const output = await replicate.run(
      "sundai-club/vishruth-omics:77fe9cad31679d4e5ce1fc12235a879e7fdf331382a6525e0faafd75622ca130",
      {
        input: {
          prompt: prompt,
          num_inference_steps: 8,
          model: "schnell"
        }
      }
    );

    const img_url = String(output);
    return NextResponse.json({ imageUrl: img_url });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
} 