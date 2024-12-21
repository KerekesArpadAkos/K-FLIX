export async function generateImageFromPrompt(prompt: string) {
  const baseUrl = 'https://image.pollinations.ai/prompt/';
  const width = 400;
  const height = 400;

  try {
      // Construct the URL with prompt and dimensions
      const url = `${baseUrl}${encodeURIComponent(prompt)}?width=${width}&height=${height}`;
      console.log('Generated Image URL:', url);

      // Return the image URL (you can optionally test if it's accessible)
      return url;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}
