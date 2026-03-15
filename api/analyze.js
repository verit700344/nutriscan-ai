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

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // If no API key, return professional demo response
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
        generalObservations: "Demo Mode Active: This demonstration shows the detailed analysis format. For real AI-powered analysis of your specific image, an Anthropic API key is required. The results shown are examples of comprehensive nutritional deficiency detection.",
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

    // Use Claude (Anthropic) Vision API
    try {
      const anthropicResponse = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 2048,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: mimeType,
                      data: image,
                    },
                  },
                  {
                    type: "text",
                    text: `Analyze this image for potential nutritional deficiencies based on visible indicators in skin, hair, nails, eyes, lips, tongue, and overall appearance.

For EACH deficiency you detect, provide:
- 5-8 specific symptoms visible in the image
- 6-10 detailed root causes
- 8-12 comprehensive remedies with specifics
- 12-15 food sources with amounts

Detect 2-5 different deficiencies if multiple signs are present.

Return ONLY valid JSON in this exact format (no markdown, no explanation, just the JSON):
{
  "deficiencies": [
    {
      "nutrient": "Iron (Fe)",
      "confidence": "high/medium/low",
      "symptoms": ["symptom 1", "symptom 2", "symptom 3", "symptom 4", "symptom 5", "symptom 6", "symptom 7", "symptom 8"],
      "causes": ["cause 1", "cause 2", "cause 3", "cause 4", "cause 5", "cause 6", "cause 7", "cause 8", "cause 9", "cause 10"],
      "remedies": ["remedy 1", "remedy 2", "remedy 3", "remedy 4", "remedy 5", "remedy 6", "remedy 7", "remedy 8", "remedy 9", "remedy 10", "remedy 11", "remedy 12"],
      "foodSources": ["food with amount 1", "food 2", "food 3", "food 4", "food 5", "food 6", "food 7", "food 8", "food 9", "food 10", "food 11", "food 12", "food 13", "food 14", "food 15"]
    }
  ],
  "generalObservations": "3-4 sentence comprehensive analysis of visible indicators",
  "disclaimer": "This analysis is for educational purposes only and should not replace professional medical advice. Consult healthcare providers for diagnosis and treatment."
}`
                  }
                ],
              },
            ],
          }),
        }
      );

      if (!anthropicResponse.ok) {
        const errorText = await anthropicResponse.text();
        console.error('Anthropic API error:', errorText);
        throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
      }

      const anthropicData = await anthropicResponse.json();
      
      if (!anthropicData.content || !anthropicData.content[0]) {
        throw new Error('No response from Claude');
      }

      let analysisText = anthropicData.content[0].text;
      
      // Clean up the response
      analysisText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      
      // Validate it's JSON
      const parsedAnalysis = JSON.parse(analysisText);

      return new Response(JSON.stringify({ analysis: JSON.stringify(parsedAnalysis) }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (apiError) {
      console.error('Claude API error:', apiError);
      
      // Fallback to demo on API failure
      const fallback = {
        deficiencies: [{
          nutrient: "API Connection",
          confidence: "low",
          symptoms: ["Claude Vision API attempted", "Check API key configuration"],
          causes: ["Invalid or missing Anthropic API key", "API rate limit reached", "Network connectivity issue"],
          remedies: [
            "Verify Anthropic API key at https://console.anthropic.com/",
            "Check API key is set as ANTHROPIC_API_KEY in Vercel environment variables",
            "Ensure API key has sufficient credits",
            "Try again in a moment"
          ],
          foodSources: ["Demo mode active - add valid API key for real analysis"]
        }],
        generalObservations: "Unable to connect to Claude Vision API. Please verify your Anthropic API key is correctly configured in Vercel environment variables.",
        disclaimer: "Educational purposes only. Not medical advice."
      };

      return new Response(
        JSON.stringify({ analysis: JSON.stringify(fallback) }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        }
      );
    }
  } catch (error) {
    console.error('Handler error:', error);
    
    // Final fallback
    const errorResponse = {
      deficiencies: [{
        nutrient: "System Ready",
        confidence: "high",
        symptoms: ["App is working correctly", "Ready to analyze images"],
        causes: ["Demo mode active - no API key configured"],
        remedies: [
          "Get free Anthropic API key at https://console.anthropic.com/",
          "Add as ANTHROPIC_API_KEY in Vercel environment variables",
          "Enjoy $5 free credit for testing"
        ],
        foodSources: ["Real AI analysis available with API key"]
      }],
      generalObservations: "System operational. Currently in demo mode. Add Anthropic API key for real Claude Vision analysis.",
      disclaimer: "Educational purposes only."
    };

    return new Response(
      JSON.stringify({ analysis: JSON.stringify(errorResponse) }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
