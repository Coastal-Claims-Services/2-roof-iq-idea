import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoofPrediction {
  facets: number;
  area: number;
  pitch: string;
  confidence: number;
  materials: string[];
  complexity: string;
}

interface EagleViewData {
  facets: number;
  area: number;
  pitch: string;
  materials: string[];
  complexity: string;
}

interface LearningRequest {
  satelliteImageUrl?: string;
  ourPrediction: RoofPrediction;
  eagleViewData: EagleViewData;
  address: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { satelliteImageUrl, ourPrediction, eagleViewData, address }: LearningRequest = await req.json();

    // Calculate differences between our prediction and EagleView truth
    const differences = [];
    const improvements = [];

    // Facet comparison
    if (ourPrediction.facets !== eagleViewData.facets) {
      differences.push(`Facet count difference: predicted ${ourPrediction.facets}, actual ${eagleViewData.facets}`);
    }

    // Area comparison
    const areaError = ((ourPrediction.area - eagleViewData.area) / eagleViewData.area) * 100;
    if (Math.abs(areaError) > 5) {
      differences.push(`Area error: ${areaError.toFixed(1)}% (predicted ${ourPrediction.area}, actual ${eagleViewData.area})`);
    }

    // Pitch comparison
    if (ourPrediction.pitch !== eagleViewData.pitch) {
      differences.push(`Pitch difference: predicted ${ourPrediction.pitch}, actual ${eagleViewData.pitch}`);
    }

    // Generate learning insights using OpenAI
    const learningPrompt = `
    You are an AI roof measurement system learning from expert EagleView reports.
    
    Analysis for property: ${address}
    
    Our Prediction:
    - Facets: ${ourPrediction.facets}
    - Area: ${ourPrediction.area} sq ft
    - Pitch: ${ourPrediction.pitch}
    - Materials: ${ourPrediction.materials.join(', ')}
    - Complexity: ${ourPrediction.complexity}
    
    EagleView Truth:
    - Facets: ${eagleViewData.facets}
    - Area: ${eagleViewData.area} sq ft
    - Pitch: ${eagleViewData.pitch}
    - Materials: ${eagleViewData.materials.join(', ')}
    - Complexity: ${eagleViewData.complexity}
    
    Differences found:
    ${differences.join('\n')}
    
    Based on this comparison, provide:
    1. What specific patterns we should learn to improve
    2. Which visual features we likely missed or misinterpreted
    3. Technical improvements to implement in our detection algorithms
    4. Confidence adjustments for similar roof types
    
    Focus on actionable improvements for satellite image analysis and roof measurement accuracy.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert in roof measurement AI systems, analyzing differences between predictions and professional measurements to generate specific technical improvements.'
          },
          { role: 'user', content: learningPrompt }
        ],
        max_tokens: 800,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiInsights = data.choices[0].message.content;

    // Parse AI insights to extract actionable improvements
    const insightLines = aiInsights.split('\n').filter((line: string) => line.trim());
    const patterns = insightLines.filter((line: string) => 
      line.includes('pattern') || line.includes('learn') || line.includes('detect')
    );
    const visualFeatures = insightLines.filter((line: string) => 
      line.includes('visual') || line.includes('feature') || line.includes('missed')
    );
    const technicalImprovements = insightLines.filter((line: string) => 
      line.includes('algorithm') || line.includes('improve') || line.includes('accuracy')
    );

    // Generate specific improvements based on the analysis
    if (Math.abs(areaError) > 10) {
      improvements.push("Enhanced area calculation algorithm for complex roof geometries");
    }
    if (ourPrediction.facets < eagleViewData.facets) {
      improvements.push("Improved small feature detection (dormers, extensions)");
    }
    if (ourPrediction.facets > eagleViewData.facets) {
      improvements.push("Better edge simplification to avoid over-segmentation");
    }

    const learningResult = {
      success: true,
      differences,
      improvements,
      aiInsights,
      patterns: patterns.slice(0, 3),
      visualFeatures: visualFeatures.slice(0, 3),
      technicalImprovements: technicalImprovements.slice(0, 3),
      accuracyScore: Math.max(0, 100 - Math.abs(areaError) - Math.abs(ourPrediction.facets - eagleViewData.facets) * 5),
      learningWeight: Math.abs(areaError) > 15 ? 'high' : Math.abs(areaError) > 5 ? 'medium' : 'low'
    };

    console.log('Learning analysis completed:', learningResult);

    return new Response(JSON.stringify(learningResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in roofiq-learning function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});