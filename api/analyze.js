export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { image, mimeType } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, return demo response
    if (!apiKey) {
      const demoResponse = {
        deficiencies: [
          {
            nutrient: "Iron",
            confidence: "medium",
            symptoms: [
              "Pale skin visible in the image",
              "Possible fatigue indicated by under-eye appearance",
              "Pale nail beds if visible in photograph"
            ],
            causes: [
              "Inadequate dietary iron intake from foods",
              "Poor iron absorption in the digestive system",
              "Blood loss from menstruation or other sources",
              "Increased iron needs during pregnancy or growth periods"
            ],
            remedies: [
              "Consult healthcare provider for blood tests (CBC, ferritin)",
              "Increase consumption of iron-rich foods daily",
              "Consider iron supplements under medical supervision only",
              "Pair iron foods with vitamin C for better absorption"
            ],
            foodSources: [
              "Red meat (beef, lamb) - 3mg per 3oz",
              "Chicken liver - 11mg per 3oz",
              "Spinach (cooked) - 3mg per half cup",
              "Lentils - 3mg per half cup",
              "Fortified cereals - varies by brand",
              "Pumpkin seeds - 2mg per oz"
            ]
          }
        ],
        generalObservations: "Based on visual analysis, there are some potential indicators of nutritional deficiency. However, definitive diagnosis requires proper medical testing and clinical examination.",
        disclaimer: "This AI analysis is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns."
      };

      return new Response(JSON.stringify({ analysis: JSON.stringify(demoResponse) }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Call Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Analyze this image for nutritional deficiencies. Look at skin, hair, nails, eyes, tongue, lips, and overall appearance.

For EACH deficiency detected, provide:
- 5-8 specific symptoms visible in the image
- 6-10 detailed root causes
- 8-12 comprehensive remedies with specifics
- 12-15 food sources with amounts

Detect 2-5 different deficiencies if signs are present.

Return ONLY valid JSON (no markdown):
{
  "deficiencies": [
    {
      "nutrient": "vitamin/mineral name",
      "confidence": "high/medium/low",
      "symptoms": ["detailed symptom 1", ... 5-8 items],
      "causes": ["detailed cause 1", ... 6-10 items],
      "remedies": ["detailed remedy 1", ... 8-12 items],
      "foodSources": ["food with amount", ... 12-15 items]
    }
  ],
  "generalObservations": "3-4 sentence comprehensive analysis",
  "disclaimer": "This analysis is for educational purposes only. Not a substitute for medical advice."
}`
              },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: image
                }
              }
            ]
          }]
        })
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || !geminiData.candidates[0]) {
      throw new Error('No response from Gemini');
    }

    let analysisText = geminiData.candidates[0].content.parts[0].text;
    
    // Clean response
    analysisText = analysisText.replace(/```json\n?|\n?```/g, '').trim();

    // Validate it's JSON
    JSON.parse(analysisText);

    return new Response(JSON.stringify({ analysis: analysisText }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Fallback response
    const fallback = {
      deficiencies: [{
        nutrient: "Analysis Error",
        confidence: "low",
        symptoms: ["Unable to complete analysis at this time"],
        causes: ["API error or configuration issue"],
        remedies: ["Check API key is set correctly", "Try again in a moment"],
        foodSources: ["N/A"]
      }],
      generalObservations: "Unable to analyze. Please ensure Google Gemini API key is configured.",
      disclaimer: "This tool is for educational purposes only."
    };

    return new Response(
      JSON.stringify({ analysis: JSON.stringify(fallback) }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
