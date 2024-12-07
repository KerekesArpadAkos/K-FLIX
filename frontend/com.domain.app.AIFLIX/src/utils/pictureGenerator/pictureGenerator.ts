import OpenAI from "openai";
import { openAiConfig } from "src/services/openAiConfig";
// Set your OpenAI API key
const openAiKey = openAiConfig.apiKey; // Replace with your actual API key

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: openAiKey,
  dangerouslyAllowBrowser: true,
});

/**
 * Function to generate an image using OpenAI's DALL-E model
 * @param prompt - Text prompt for the image generation
 * @returns The URL of the generated image
 */
export async function generateImageFromPrompt(prompt: string): Promise<string | null> {
  try {
    // Call OpenAI's API to generate an image
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1, // Number of images to generate
      size: "512x512", // Image resolution
    });

    // Extract the URL of the generated image
    const imageUrl = response.data[0]?.url;
    console.log("Generated Image URL:", imageUrl);

    return imageUrl || null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}