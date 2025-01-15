import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Criar cliente Supabase com contexto do servidor
    const supabase = createServerComponentClient({ cookies });

    // Verificar autenticação de forma segura
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
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
    } = await request.json();

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
      story: {
        title,
        content
      }
    });
  } catch (error: any) {
    console.error('Erro ao gerar história:', error);
    
    // Se for um erro da OpenAI, retornar a mensagem específica
    if (error?.response?.data?.error?.message) {
      return NextResponse.json(
        { error: error.response.data.error.message },
        { status: 500 }
      );
    }
    
    // Erro genérico
    return NextResponse.json(
      { error: 'Não foi possível gerar a história. Por favor, tente novamente.' },
      { status: 500 }
    );
  }
}
