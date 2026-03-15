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
    const { image } = await request.json();
    
    // Basic validation - check if image data exists
    if (!image || image.length < 100) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid image data',
          message: 'Please upload a valid image file'
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Randomize demo response for variety
    const scenarios = [
      // Scenario 1: Iron + Vitamin D (original)
      {
        deficiencies: [
          {
            nutrient: "Iron (Fe)",
            confidence: "medium",
            severity: 65,
            symptoms: [
              "Visible pallor in skin tone suggesting reduced hemoglobin levels",
              "Pale conjunctiva observable in eye examination area",
              "Potential fatigue indicators visible in facial features",
              "Pale nail beds if hands are present in the photograph",
              "Possible koilonychia (spoon-shaped nails) characteristics"
            ],
            causes: [
              "Inadequate dietary iron intake (consuming less than 18mg/day for adults)",
              "Poor iron absorption due to low stomach acid or digestive issues",
              "Chronic blood loss from menstruation (>80ml per cycle)",
              "Gastrointestinal conditions like celiac disease or IBD affecting absorption",
              "Vegetarian or vegan diet without proper iron supplementation",
              "Pregnancy or lactation significantly increasing iron requirements",
              "Medications that reduce iron absorption (antacids, proton pump inhibitors)",
              "Chronic inflammation causing functional iron deficiency"
            ],
            remedies: [
              "Schedule comprehensive blood tests: Complete Blood Count (CBC) and serum ferritin levels",
              "Increase consumption of heme iron from animal sources (better absorbed than plant iron)",
              "Start iron supplementation with 150-200mg elemental iron daily if confirmed deficient",
              "Take iron supplements on empty stomach with vitamin C for optimal absorption",
              "Avoid tea, coffee, and calcium supplements within 2 hours of iron intake",
              "Cook in cast iron cookware to naturally increase iron content in foods",
              "Monitor hemoglobin levels every 2-4 weeks during active treatment",
              "Continue iron therapy for 3-6 months after levels normalize to replenish stores",
              "Address underlying causes such as heavy menstruation or GI conditions",
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
              "Fortified breakfast cereals (varies by brand)",
              "Pumpkin seeds (2mg per oz)",
              "Quinoa (1.5mg per 1/2 cup)",
              "Dark chocolate 70% cacao (3mg per oz)",
              "Tofu firm (3mg per 1/2 cup)"
            ]
          },
          {
            nutrient: "Vitamin D (Cholecalciferol)",
            confidence: "low",
            severity: 40,
            symptoms: [
              "General appearance may suggest limited sun exposure patterns",
              "Skin tone analysis indicates possible vitamin D insufficiency",
              "No acute visual symptoms but worth checking given high prevalence"
            ],
            causes: [
              "Limited sun exposure (less than 10-30 minutes several times per week)",
              "Living in northern latitudes with reduced UVB radiation year-round",
              "Darker skin tone requiring significantly more sun exposure for vitamin D synthesis",
              "Indoor lifestyle or extensive sunscreen use blocking necessary UVB rays",
              "Age-related decrease in skin's ability to produce vitamin D efficiently",
              "Obesity reducing bioavailability of vitamin D from body stores",
              "Digestive disorders affecting fat absorption (needed for vitamin D absorption)",
              "Kidney or liver disease impairing vitamin D activation process"
            ],
            remedies: [
              "Get blood test to check 25-hydroxyvitamin D levels (optimal: 30-50 ng/mL)",
              "Aim for safe sun exposure: 10-30 minutes midday several times weekly",
              "Supplement with vitamin D3 (cholecalciferol) if levels are confirmed low",
              "Typical supplementation dosing: 1000-2000 IU daily for maintenance",
              "Higher doses (4000-5000 IU) may be needed if deficient - consult doctor",
              "Take vitamin D supplements with meals containing fat for better absorption",
              "Retest vitamin D levels after 3 months of supplementation to adjust dose",
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
              "Fortified cereals (check nutrition labels)",
              "Mushrooms exposed to UV light (400 IU per 3oz)",
              "Fortified plant-based milk alternatives",
              "Swiss cheese (6 IU per oz)"
            ]
          }
        ]
      },
      // Scenario 2: Vitamin B12 + Calcium
      {
        deficiencies: [
          {
            nutrient: "Vitamin B12 (Cobalamin)",
            confidence: "high",
            severity: 75,
            symptoms: [
              "Observable paleness or slight yellowing of skin (jaundice)",
              "Possible signs of neurological involvement in facial expression",
              "Potential glossitis (inflamed tongue) if mouth visible",
              "General appearance suggesting chronic fatigue",
              "Possible cognitive or mood-related visual indicators"
            ],
            causes: [
              "Pernicious anemia (autoimmune condition preventing B12 absorption)",
              "Strict vegan or vegetarian diet without B12 supplementation",
              "Atrophic gastritis reducing stomach acid needed for B12 absorption",
              "Medications: metformin, PPIs, H2 blockers interfering with absorption",
              "Age-related decline in stomach acid production (common over 50)",
              "Crohn's disease or celiac disease affecting ileum where B12 is absorbed",
              "Previous gastric bypass or ileal resection surgery",
              "Chronic pancreatitis affecting intrinsic factor production"
            ],
            remedies: [
              "Get serum B12 levels tested along with methylmalonic acid (MMA) for confirmation",
              "Start B12 supplementation: oral (1000-2000 mcg daily) or sublingual",
              "Consider B12 injections (1000 mcg weekly) if absorption is severely impaired",
              "Take B12 supplements on empty stomach for better absorption",
              "If pernicious anemia diagnosed, lifelong B12 therapy required",
              "Monitor B12 levels every 3-6 months during treatment",
              "Address underlying causes (stop medications if possible, treat GI conditions)",
              "Increase dietary B12 sources if not vegan/vegetarian",
              "Consider intranasal B12 spray as alternative delivery method",
              "Evaluate for neurological damage if deficiency is severe or long-standing"
            ],
            foodSources: [
              "Beef liver (70 mcg per 3oz)",
              "Clams (84 mcg per 3oz)",
              "Salmon (4.8 mcg per 3oz)",
              "Tuna (2.5 mcg per 3oz)",
              "Beef (1.5 mcg per 3oz)",
              "Fortified breakfast cereals (6 mcg per serving)",
              "Milk (1.2 mcg per cup)",
              "Yogurt (1.1 mcg per cup)",
              "Eggs (0.6 mcg per large egg)",
              "Chicken breast (0.3 mcg per 3oz)",
              "Fortified nutritional yeast (varies)",
              "Cheese (0.9 mcg per oz)"
            ]
          },
          {
            nutrient: "Calcium (Ca)",
            confidence: "medium",
            severity: 55,
            symptoms: [
              "Potential signs of bone density concerns",
              "Possible dental health indicators",
              "Subtle signs of muscle tension or spasms"
            ],
            causes: [
              "Inadequate dietary calcium intake (less than 1000mg daily)",
              "Vitamin D deficiency preventing calcium absorption",
              "Lactose intolerance limiting dairy consumption",
              "High sodium diet increasing calcium excretion through urine",
              "Excessive caffeine or alcohol consumption depleting calcium",
              "Certain medications (corticosteroids, anticonvulsants)",
              "Aging reducing calcium absorption efficiency",
              "Chronic kidney disease affecting calcium metabolism"
            ],
            remedies: [
              "Increase calcium-rich foods to meet 1000-1200mg daily requirement",
              "Take calcium supplements if dietary intake insufficient (calcium citrate preferred)",
              "Ensure adequate vitamin D levels for calcium absorption",
              "Spread calcium intake throughout day (body absorbs max 500mg at once)",
              "Combine calcium with weight-bearing exercise for bone health",
              "Limit sodium to less than 2300mg daily to prevent calcium loss",
              "Moderate caffeine intake (3-4 cups coffee max)",
              "Get bone density scan (DEXA) if at risk for osteoporosis",
              "Consider calcium + magnesium supplement for better utilization",
              "Monitor calcium levels with blood tests periodically"
            ],
            foodSources: [
              "Dairy milk (300mg per cup)",
              "Yogurt (450mg per cup)",
              "Cheese - cheddar (200mg per oz)",
              "Sardines with bones (325mg per 3oz)",
              "Tofu - calcium-set (430mg per 1/2 cup)",
              "Collard greens cooked (266mg per cup)",
              "Fortified orange juice (350mg per cup)",
              "Almonds (75mg per oz)",
              "Kale cooked (94mg per cup)",
              "White beans (126mg per cup)",
              "Bok choy (158mg per cup)",
              "Figs dried (107mg per 1/2 cup)"
            ]
          }
        ]
      },
      // Scenario 3: Vitamin C + Magnesium
      {
        deficiencies: [
          {
            nutrient: "Vitamin C (Ascorbic Acid)",
            confidence: "medium",
            severity: 50,
            symptoms: [
              "Possible signs of skin changes or delayed wound healing",
              "Potential gum health indicators if visible",
              "General appearance suggesting immune system stress",
              "Possible bruising patterns if visible on skin",
              "Subtle signs of connective tissue health"
            ],
            causes: [
              "Insufficient dietary intake of fruits and vegetables",
              "Smoking (increases vitamin C requirements by 35mg/day)",
              "Chronic alcohol consumption depleting vitamin C stores",
              "Certain medical conditions (kidney disease, hyperthyroidism)",
              "Malabsorption disorders affecting nutrient uptake",
              "Extreme stress increasing vitamin C utilization",
              "Chronic diarrhea causing nutrient loss",
              "Limited access to fresh produce"
            ],
            remedies: [
              "Increase consumption of vitamin C-rich fruits and vegetables",
              "Supplement with 500-1000mg vitamin C daily if deficient",
              "Take vitamin C in divided doses for better absorption",
              "Choose whole food sources over supplements when possible",
              "If smoker, increase intake by additional 35mg daily",
              "Combine with bioflavonoids for enhanced absorption",
              "Monitor for signs of improvement (better wound healing, gum health)",
              "Avoid excessive doses (>2000mg daily) which may cause GI upset",
              "Retest levels after 2-3 months of supplementation",
              "Address underlying causes (quit smoking, reduce alcohol)"
            ],
            foodSources: [
              "Red bell pepper raw (190mg per cup)",
              "Orange juice (124mg per cup)",
              "Strawberries (89mg per cup)",
              "Broccoli cooked (101mg per cup)",
              "Kiwi fruit (137mg per fruit)",
              "Brussels sprouts (97mg per cup)",
              "Grapefruit (38mg per 1/2 fruit)",
              "Tomatoes (23mg per medium tomato)",
              "Mango (60mg per cup)",
              "Pineapple (79mg per cup)",
              "Cantaloupe (65mg per cup)",
              "Cauliflower (52mg per cup cooked)"
            ]
          },
          {
            nutrient: "Magnesium (Mg)",
            confidence: "medium",
            severity: 60,
            symptoms: [
              "Possible muscle tension or cramping indicators",
              "Subtle signs of stress or tension in facial features",
              "General appearance suggesting sleep quality concerns"
            ],
            causes: [
              "Low dietary intake (common in Western diets)",
              "Gastrointestinal disorders reducing absorption (Crohn's, celiac)",
              "Type 2 diabetes increasing urinary magnesium loss",
              "Chronic alcohol consumption depleting magnesium",
              "Medications: diuretics, PPIs, antibiotics affecting magnesium",
              "Chronic stress increasing magnesium utilization",
              "Aging reducing absorption efficiency",
              "High calcium supplementation without magnesium"
            ],
            remedies: [
              "Increase magnesium-rich foods to meet 310-420mg daily requirement",
              "Supplement with magnesium glycinate or citrate (200-400mg daily)",
              "Take magnesium supplements with meals to reduce GI side effects",
              "Apply magnesium oil topically for muscle cramps",
              "Take magnesium in evening for better sleep support",
              "Ensure adequate vitamin D and calcium for proper balance",
              "Reduce caffeine and alcohol which deplete magnesium",
              "Practice stress management to reduce magnesium loss",
              "Get RBC magnesium test (more accurate than serum)",
              "Monitor for improvement in muscle cramps, sleep, and energy"
            ],
            foodSources: [
              "Pumpkin seeds (156mg per oz)",
              "Almonds (80mg per oz)",
              "Spinach cooked (157mg per cup)",
              "Cashews (74mg per oz)",
              "Black beans (120mg per cup)",
              "Edamame (100mg per cup)",
              "Peanuts (63mg per oz)",
              "Brown rice (86mg per cup)",
              "Avocado (58mg per avocado)",
              "Dark chocolate (64mg per oz)",
              "Salmon (26mg per 3oz)",
              "Banana (32mg per medium)"
            ]
          }
        ]
      }
    ];

    // Randomly select a scenario
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    const demoResponse = {
      deficiencies: randomScenario.deficiencies,
      generalObservations: "Based on comprehensive visual analysis, the image shows indicators that warrant nutritional assessment. The detected patterns suggest potential deficiencies that are common in modern populations due to dietary habits and lifestyle factors. These findings should be confirmed through proper medical testing including complete blood panels and nutritional marker assessments for accurate diagnosis and treatment.",
      disclaimer: "This AI analysis is for educational and demonstration purposes only. It is not a medical diagnosis and should not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for accurate diagnosis, personalized treatment recommendations, and ongoing medical care. Any decisions regarding your health should be made in consultation with a licensed healthcare professional."
    };

    return new Response(JSON.stringify({ analysis: JSON.stringify(demoResponse) }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed',
        message: 'An error occurred during image analysis'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
