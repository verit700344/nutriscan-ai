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

    // If no API key, show GOOD demo response (not error)
    if (!apiKey || apiKey === '' || apiKey === 'undefined') {
      const demoResponse = {
        deficiencies: [
          {
            nutrient: "Iron (Fe)",
            confidence: "medium",
            symptoms: [
              "Visible pallor in skin tone suggesting reduced hemoglobin",
              "Pale conjunctiva if eyes are visible in the photograph",
              "Potential fatigue indicators in facial features",
              "Pale nail beds if hands are visible",
              "Possible koilonychia (spoon-shaped nails) if present"
            ],
            causes: [
              "Inadequate dietary iron intake (consuming less than 18mg/day for adults)",
              "Poor iron absorption due to low stomach acid or digestive issues",
              "Chronic blood loss from menstruation (>80ml per cycle)",
              "Gastrointestinal conditions like celiac disease or IBD affecting absorption",
              "Vegetarian or vegan diet without proper supplementation",
              "Pregnancy or lactation increasing iron requirements",
              "Medications that reduce iron absorption (antacids, PPIs)",
              "Chronic inflammation causing functional iron deficiency"
            ],
            remedies: [
              "Schedule blood tests: Complete Blood Count (CBC) and serum ferritin levels",
              "Increase consumption of heme iron from animal sources (better absorbed)",
              "Start iron supplementation with 150-200mg elemental iron daily if deficient",
              "Take iron supplements on empty stomach with vitamin C for better absorption",
              "Avoid tea, coffee, and calcium supplements within 2 hours of iron intake",
              "Cook in cast iron cookware to increase iron content in foods",
              "Monitor hemoglobin levels every 2-4 weeks during treatment",
              "Continue iron therapy for 3-6 months after levels normalize to replenish stores",
              "Address underlying causes like heavy menstruation or GI conditions",
              "Consider IV iron therapy if oral supplements cause severe side effects"
            ],
            foodSources: [
              "Beef liver (5mg iron per 3oz serving)",
              "Red meat - beef, lamb (2.5mg per 3oz)",
              "Chicken liver (11mg per 3oz)",
              "Oysters (8mg per 3oz)",
              "Sardines (2.5mg per 3oz)",
              "Spinach cooked (3mg per 1/2 cup)",
              "Lentils (3mg per 1/2 cup)",
              "Kidney beans (2mg per 1/2 cup)",
              "Fortified breakfast cereals (varies, check labels)",
              "Pumpkin seeds (2mg per oz)",
              "Quinoa (1.5mg per 1/2 cup)",
              "Dark chocolate 70% cacao (3mg per oz)",
              "Tofu firm (3mg per 1/2 cup)"
            ]
          },
          {
            nutrient: "Vitamin D (Cholecalciferol)",
            confidence: "low",
            symptoms: [
              "General appearance may suggest limited sun exposure",
              "Skin tone analysis indicates possible insufficiency",
              "No acute visual symptoms but worth checking given prevalence"
            ],
            causes: [
              "Limited sun exposure (less than 10-30 minutes several times per week)",
              "Living in northern latitudes with less UVB radiation",
              "Darker skin tone requiring more sun exposure for vitamin D synthesis",
              "Indoor lifestyle or extensive sunscreen use blocking UVB",
              "Age-related decrease in skin's ability to produce vitamin D",
              "Obesity reducing bioavailability of vitamin D",
              "Digestive disorders affecting fat absorption (needed for vitamin D)",
              "Kidney or liver disease impairing vitamin D activation"
            ],
            remedies: [
              "Get blood test to check 25-hydroxyvitamin D levels",
              "Aim for safe sun exposure: 10-30 minutes midday several times weekly",
              "Supplement with vitamin D3 (cholecalciferol) if levels are low",
              "Typical supplementation: 1000-2000 IU daily for maintenance",
              "Higher doses (4000-5000 IU) may be needed if deficient - consult doctor",
              "Take vitamin D supplements with meals containing fat for absorption",
              "Retest vitamin D levels after 3 months of supplementation",
              "Consider vitamin D + calcium combination if over age 50"
            ],
            foodSources: [
              "Fatty fish - salmon (570 IU per 3oz)",
              "Mackerel (360 IU per 3oz)",
              "Sardines canned (170 IU per 3oz)",
              "Cod liver oil (1360 IU per tablespoon)",
              "Egg yolks (40 IU per large egg)",
              "Fortified milk (120 IU per cup)",
              "Fortified orange juice (140 IU per cup)",
              "Fortified yogurt (varies by brand)",
              "Fortified cereals (check labels)",
              "Mushrooms exposed to UV light (400 IU per 3oz)",
              "Fortified plant-based milk alternatives",
              "Swiss cheese (6 IU per oz)"
            ]
          }
        ],
        generalObservations: "Demo Mode Active: This is a demonstration showing how the AI analysis works. The observations shown are examples of what the AI would detect with an API key configured. Visible indicators in the image may suggest potential nutritional considerations, but these require medical confirmation through proper blood tests.",
        disclaimer: "This AI analysis is for educational and demonstration purposes only. It is not a medical diagnosis and should not replace professional medical advice. Always consult qualified healthcare providers for accurate diagnosis and treatment recommendations."
      };

      return new Response(JSON.stringify({ analysis: JSON.stringify(demoResponse) }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Try to call Gemini API
    try {
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
- 5-8 specific symptoms visible
- 6-10 detailed root causes
- 8-12 comprehensive remedies with specifics
- 12-15 food sources with amounts

Detect 2-5 different deficiencies if signs present.

Return ONLY valid JSON (no markdown):
{
  "deficiencies": [
    {
      "nutrient": "vitamin/mineral name",
      "confidence": "high/medium/low",
      "symptoms": ["detailed 1", ... 5-8],
      "causes": ["detailed 1", ... 6-10],
      "remedies": ["detailed 1", ... 8-12],
      "foodSources": ["with amount", ... 12-15]
    }
  ],
  "generalObservations": "3-4 sentence analysis",
  "disclaimer": "Educational purposes only. Not medical advice."
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

      const geminiData = await geminiResponse.json();
      
      if (!geminiData.candidates || !geminiData.candidates[0]) {
        throw new Error('No Gemini response');
      }

      let analysisText = geminiData.candidates[0].content.parts[0].text;
      analysisText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      JSON.parse(analysisText); // Validate

      return new Response(JSON.stringify({ analysis: analysisText }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      // If Gemini fails, fall back to demo
      const fallbackResponse = {
        deficiencies: [{
          nutrient: "API Connection Issue",
          confidence: "low",
          symptoms: ["Gemini API call failed - check API key validity"],
          causes: ["Invalid API key", "API rate limit", "Network issue"],
          remedies: ["Verify API key at https://aistudio.google.com/app/apikey", "Check API key is correctly set in Vercel environment variables"],
          foodSources: ["N/A"]
        }],
        generalObservations: "Unable to connect to Gemini API. Using fallback mode.",
        disclaimer: "Educational purposes only."
      };

      return new Response(
        JSON.stringify({ analysis: JSON.stringify(fallbackResponse) }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }
  } catch (error) {
    console.error('Handler error:', error);
    
    const errorResponse = {
      deficiencies: [{
        nutrient: "System Error",
        confidence: "low",
        symptoms: ["Unexpected error occurred"],
        causes: ["Server issue", "Request format problem"],
        remedies: ["Try uploading the image again", "Contact support if issue persists"],
        foodSources: ["N/A"]
      }],
      generalObservations: "Analysis could not be completed due to a system error.",
      disclaimer: "Educational purposes only."
    };

    return new Response(
      JSON.stringify({ analysis: JSON.stringify(errorResponse) }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
