export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // DEMO MODE: Return a realistic mock response for demonstration
    // In production, you would need to add an ANTHROPIC_API_KEY environment variable
    const demoResponse = {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            deficiencies: [
              {
                nutrient: "Iron",
                confidence: "medium",
                symptoms: [
                  "Pale skin or pallor visible in the image",
                  "Possible signs of fatigue or tiredness around the eyes",
                  "Pale nail beds if visible"
                ],
                causes: [
                  "Inadequate dietary iron intake",
                  "Poor iron absorption",
                  "Blood loss or heavy menstrual periods",
                  "Increased iron needs during growth or pregnancy"
                ],
                remedies: [
                  "Consult a healthcare provider for proper diagnosis and blood tests",
                  "Increase consumption of iron-rich foods",
                  "Consider iron supplements only under medical supervision",
                  "Pair iron-rich foods with vitamin C for better absorption"
                ],
                foodSources: [
                  "Red meat and poultry",
                  "Spinach and kale",
                  "Lentils and beans",
                  "Fortified cereals",
                  "Pumpkin seeds"
                ]
              },
              {
                nutrient: "Vitamin D",
                confidence: "low",
                symptoms: [
                  "General appearance may suggest limited sun exposure",
                  "Skin tone analysis indicates possible deficiency"
                ],
                causes: [
                  "Limited sun exposure",
                  "Inadequate dietary vitamin D intake",
                  "Darker skin tone (requires more sun exposure for vitamin D production)",
                  "Age-related decreased skin synthesis"
                ],
                remedies: [
                  "Increase safe sun exposure (10-30 minutes several times per week)",
                  "Add vitamin D-fortified foods to your diet",
                  "Consider vitamin D3 supplements after consulting a doctor",
                  "Get blood levels checked to determine appropriate dosage"
                ],
                foodSources: [
                  "Fatty fish (salmon, mackerel, sardines)",
                  "Egg yolks",
                  "Fortified milk and dairy",
                  "Fortified orange juice",
                  "Mushrooms exposed to sunlight"
                ]
              }
            ],
            generalObservations: "Based on the visual analysis, there are some indicators that suggest possible nutritional deficiencies, particularly related to iron and vitamin D. The observations are preliminary and should be confirmed with proper medical testing. Individual variations in appearance can be influenced by many factors beyond nutrition.",
            disclaimer: "This analysis is for educational and informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. The AI analysis is based on visual patterns and cannot replace proper blood tests and clinical examination."
          })
        }
      ]
    };

    return new Response(JSON.stringify(demoResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Analysis failed', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
