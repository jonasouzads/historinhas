import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { OpenAI } from 'openai';

interface StoryRequest {
  childName: string;
  childAge: number;
  childGender: string;
  storyTheme: string;
  storyMood: string;
  storyValues: string[];
  additionalDetails: string;
}

interface StoryResponse {
  success: boolean;
  story?: {
    title: string;
    content: string;
  };
  error?: string;
}

export async function POST(request: Request): Promise<NextResponse<StoryResponse>> {
  try {
    // Criar cliente Supabase com contexto do servidor
    const supabase = createServerComponentClient({ cookies });

    // Verificar autenticação de forma segura
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Se não houver uma chave API configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API key não configurada' },
        { status: 500 }
      );
    }

    const {
      childName,
      childAge,
      childGender,
      storyTheme,
      storyMood = 'feliz',
      storyValues = [],
      additionalDetails,
    }: StoryRequest = await request.json();

    const prompt = `Crie uma história infantil mágica em português para ${childName}, 
    ${childGender === 'menino' ? 'um menino' : 'uma menina'} de ${childAge} anos.
    
    Tema principal: ${storyTheme}
    Tom da história: ${storyMood}
    ${storyValues.length > 0 ? `Valores a serem ensinados: ${storyValues.join(', ')}` : ''}
    ${additionalDetails ? `Detalhes sobre a criança: ${additionalDetails}` : ''}
    
    Instruções específicas:
    1. Crie um título criativo e cativante que inclua elementos mágicos
    2. Use linguagem apropriada para ${childAge} anos
    3. Divida a história em 4-6 parágrafos curtos e bem estruturados
    4. Use o nome ${childName} como protagonista
    5. Inclua elementos de:
       - Imaginação e magia
       - Desenvolvimento pessoal
       - Interação com outros personagens
       - Resolução positiva de desafios
    6. Termine com uma mensagem que reforce os valores escolhidos
    7. A história deve ter entre 300-500 palavras
    
    Formato da resposta:
    TÍTULO: [Título criativo da história]
    HISTÓRIA: [Conteúdo da história em parágrafos]`;

    console.log('Enviando prompt para OpenAI:', prompt);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um especialista em criar histórias infantis mágicas e educativas.
          Suas histórias são conhecidas por serem:
          - Envolventes e adequadas à idade
          - Ricas em imaginação e elementos mágicos
          - Educativas e com valores positivos
          - Estruturadas em parágrafos claros
          - Com títulos criativos e cativantes`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1000,
      stream: false
    });

    console.log('Resposta da OpenAI:', completion.choices[0]?.message?.content);

    const storyText = completion.choices[0]?.message?.content || '';
    
    // Extrair título e conteúdo da resposta
    const titleMatch = storyText.match(/TÍTULO:\s*(.+?)(?=\n|$)/);
    const contentMatch = storyText.match(/HISTÓRIA:\s*([\s\S]+)$/);

    const title = titleMatch ? titleMatch[1].trim() : `A Mágica Aventura de ${childName}`;
    const content = contentMatch 
      ? contentMatch[1].trim() 
      : storyText.replace(/TÍTULO:.*\n/, '').trim();

    // Retornar apenas o título e conteúdo gerados
    return NextResponse.json({
      success: true,
      story: {
        title,
        content
      }
    });
  } catch (error) {
    console.error('Erro ao gerar história:', error);

    // Se for um erro da OpenAI, retornar a mensagem específica
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'error' in error.response.data &&
      error.response.data.error &&
      typeof error.response.data.error === 'object' &&
      'message' in error.response.data.error
    ) {
      const openAIError = error.response.data.error as { message: string };
      return NextResponse.json(
        { success: false, error: openAIError.message },
        { status: 500 }
      );
    }

    // Erro genérico
    return NextResponse.json(
      { success: false, error: 'Não foi possível gerar a história. Por favor, tente novamente.' },
      { status: 500 }
    );
  }
}
