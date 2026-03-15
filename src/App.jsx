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

    // Call Google Gemini Vision API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `You are an expert nutritionist and medical AI analyzing images for signs of nutritional deficiencies. 

Analyze this image COMPREHENSIVELY for ANY visible signs of nutritional deficiencies. Look for indicators in:
- Skin (color, texture, dryness, lesions, pallor, hyperpigmentation)
- Hair (texture, color, thinning, brittleness)  
- Nails (color, ridges, brittleness, spoon-shaped, white spots)
- Eyes (redness, dryness, dark circles, pale conjunctiva)
- Tongue (color, coating, swelling, smoothness, cracks)
- Lips (cracks, color, dryness, angular cheilitis)
- Overall appearance (muscle wasting, edema, body composition)

For EACH deficiency you detect, provide:

1. **Detailed Symptoms** (5-8 specific observations):
   - Describe what you see in medical detail
   - Include primary and secondary indicators
   - Mention severity when possible
   - Note specific anatomical locations

2. **In-Depth Root Causes** (6-10 causes):
   - Dietary inadequacies (specific food groups lacking)
   - Malabsorption issues (GI conditions, medications)
   - Lifestyle factors (sun exposure, stress, sleep)
   - Medical conditions (chronic diseases, surgeries)
   - Age and gender-specific factors
   - Genetic predispositions
   - Environmental factors
   - Drug interactions

3. **Comprehensive Remedies** (8-12 actionable steps):
   - Immediate dietary changes
   - Supplementation protocols (dosage, timing, form)
   - Lifestyle modifications
   - Medical tests to confirm deficiency
   - Monitoring guidelines
   - When to see a specialist
   - Complementary interventions
   - Timeline for improvement
   - Preventive measures

4. **Extensive Food Sources** (12-15 foods):
   - Top animal-based sources with amounts
   - Plant-based alternatives
   - Fortified foods
   - Bioavailability considerations
   - Food combinations for better absorption
   - Preparation methods that preserve nutrients

IMPORTANT INSTRUCTIONS:
- Detect 2-5 different deficiencies if multiple signs are present
- Be thorough and specific in ALL sections
- Don't repeat generic information - be DETAILED
- Assign confidence (high/medium/low) based on clarity of visual indicators
- If image shows tongue, check for: B12 (glossitis), Iron (pale), Folate (red/smooth), B3 (inflamed)
- If image shows nails, check for: Iron (pale, spoon), Zinc (white spots), Biotin (brittle)
- If image shows skin, check for: Vitamin A (dry), Vitamin C (bruising), B vitamins (dermatitis)
- If image shows eyes, check for: Vitamin A (dry), Iron (pale conjunctiva), B2 (bloodshot)

Return ONLY a JSON object (no markdown, no preamble) in this EXACT format:
{
  "deficiencies": [
    {
      "nutrient": "Specific vitamin/mineral name",
      "confidence": "high/medium/low",
      "symptoms": ["detailed symptom 1", "detailed symptom 2", ... 5-8 symptoms],
      "causes": ["detailed cause 1", "detailed cause 2", ... 6-10 causes],
      "remedies": ["detailed remedy 1", "detailed remedy 2", ... 8-12 remedies],
      "foodSources": ["food with amount 1", "food with amount 2", ... 12-15 foods]
    }
  ],
  "generalObservations": "Comprehensive 3-4 sentence analysis of overall health status visible in image, mentioning specific anatomical features examined and their condition",
  "disclaimer": "This AI-powered analysis is for educational and informational purposes only and should not replace professional medical advice. Visual assessment has limitations and cannot substitute blood tests or clinical examination. Always consult qualified healthcare providers for diagnosis and treatment."
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
      throw new Error('No response from Gemini API');
    }

    const analysisText = geminiData.candidates[0].content.parts[0].text;
    
    // Clean up the response
    const cleanedText = analysisText
      .replace(/```json\n?|\n?```/g, '')
      .trim();

    return new Response(JSON.stringify({ analysis: cleanedText }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Fallback response if API fails
    const fallbackResponse = {
      deficiencies: [
        {
          nutrient: "Unable to Complete Analysis",
          confidence: "low",
          symptoms: ["API connection error or rate limit exceeded"],
          causes: ["Temporary service unavailability", "API key configuration issue"],
          remedies: ["Please try again in a few moments", "Ensure API key is properly configured in environment variables"],
          foodSources: ["N/A"]
        }
      ],
      generalObservations: "Unable to analyze the image at this time. This may be due to API rate limits, network issues, or image format problems. Please try again.",
      disclaimer: "This tool is for educational purposes only. Consult a healthcare professional for medical advice."
    };

    return new Response(
      JSON.stringify({ analysis: JSON.stringify(fallbackResponse) }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
