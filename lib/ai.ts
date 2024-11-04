import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCvkFc52rV3PmbvnOTxGXoZDLBaTF_W_Z4");

export async function analyzeTodoContent(title: string, description?: string, image?: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-flash" });

  const prompt = `
    Analyze this todo item:
    Title: ${title}
    Description: ${description || 'N/A'}
    Has Image: ${image ? 'Yes' : 'No'}

    Please provide:
    1. Suggested tags (3-5 relevant keywords)
    2. A brief description if none exists
    3. Suggested folder category
    4. Priority suggestion
    5. Related tasks or insights

    Format the response as JSON with these keys: tags, description, folder, priority, insights
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

export async function suggestReorganization(todos: any[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-flash" });

  const prompt = `
    Analyze these todos and suggest how to organize them into folders:
    ${JSON.stringify(todos)}

    Consider:
    - Common themes and patterns
    - Project groupings
    - Time-based organization
    - Priority levels
    - Tag relationships

    Return a JSON array of folder suggestions with:
    - name: folder name
    - description: brief description
    - todoIds: array of related todo IDs
    - tags: common tags for this group
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

export async function analyzeImage(imageData: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-flash" });

  const prompt = `
    Analyze this image and provide:
    1. Key objects or elements identified
    2. Suggested tags
    3. Any text content visible
    4. Related task suggestions
    5. Priority assessment

    Format as JSON with: objects, tags, textContent, taskSuggestions, priority
  `;

  // Convert base64 to proper format if needed
  const imageInput = imageData.startsWith('data:image') 
    ? imageData 
    : `data:image/jpeg;base64,${imageData}`;

  const result = await model.generateContent([prompt, imageInput]);
  const response = await result.response;
  return JSON.parse(response.text());
}