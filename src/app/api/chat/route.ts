import { auth, currentUser } from "@clerk/nextjs/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN, {
  retry_on_error: true,
  use_cache: false,
});

export async function POST(request: Request) {
  try {
    const { userId, redirectToSignIn } = await auth();
    if (userId == null) return redirectToSignIn();
    const user = await currentUser();

    const { prompt } = await request.json();

    const systemPrompt = `Generate a professional JSON resume based on this bio. Return ONLY the JSON object, no additional text:
{
  "profile": {
    "firstName": "",
    "lastName": "",
    "email": "",
    "phoneNumber": "",
    "bio": "",
    "location": "",
    "profession": "",
  },
  "education": [
    {
      "institution": "",
      "degree": "",
      "startDate": "",
      "endDate": ""
    }
  ],
  "experience": [
    {
      "jobTitle": "",
      "company": "",
      "location": "",
      "description": "",
      "startDate": "",
      "endDate": ""
    }
  ],
  "skills": [
    {"skillName": ""}
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "duration": "",
      "link": ""
    }
  ],
   "achievements": [
     {
       "title": "",
        "description": "",
        "date": ""
      }
  ]
}

Bio: ${prompt}

Remember to return ONLY the JSON object with no additional text or formatting.`;

    const response = await hf.textGeneration({
      // model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      model: "Qwen/Qwen2.5-72B-Instruct",
      inputs: systemPrompt,
      parameters: {
        max_new_tokens: 4098,
        temperature: 0.3, // Lower temperature for more structured output
        top_p: 0.9,
        repetition_penalty: 1.2,
        return_full_text: false,
      },
    });

    if (!response.generated_text) {
      throw new Error("No response generated");
    }

    // Clean and parse the response
    let jsonString = response.generated_text
      .replace(/```json|```/g, "") // Remove code blocks if present
      .replace(/^[^{]*/g, "") // Remove any text before the first {
      .replace(/[^}]*$/g, "") // Remove any text after the last }
      .trim();

    const parsedJson = JSON.parse(jsonString);

    return Response.json(parsedJson);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate resume",
      },
      { status: 500 }
    );
  }
}
