import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const DISCIPLINE_CONTEXT: Record<string, string> = {
  natation:      'natation en piscine (crawl, dos, brasse, exercices avec planche)',
  musculation:   'musculation en salle (haltères, barres, machines, poids du corps)',
  cardio:        'cardio (course à pied, vélo, corde à sauter, rameur, HIIT)',
  boxe:          'boxe anglaise (shadow boxing, travail au sac, combinaisons, déplacements)',
}

export async function POST(req: NextRequest) {
  const { discipline } = await req.json()
  const context = DISCIPLINE_CONTEXT[discipline] ?? discipline

  const prompt = `Tu es un coach sportif expert. Génère un programme de séance pour : ${context}.

Retourne UNIQUEMENT un objet JSON valide, sans markdown ni texte autour, avec cette structure exacte :
{
  "exercises": [
    {
      "name": "Nom de l'exercice",
      "sets": 3,
      "reps": 12,
      "duration_sec": null,
      "rest_sec": 60,
      "tips": "Un conseil technique court et actionnable"
    }
  ]
}

Contraintes :
- 5 à 7 exercices progressifs (échauffement → travail principal → retour au calme)
- Natation & cardio → duration_sec (ex: 120), sets/reps à null
- Musculation & boxe → sets + reps, duration_sec à null
- tips : 1 phrase max, concrète, centrée sur la technique ou la sécurité
- JSON uniquement, aucun texte avant ou après`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[coach route] ERREUR COMPLETE:', JSON.stringify(err, null, 2), err.message, err.stack)
    return NextResponse.json({ error: 'Erreur lors de la génération du programme' }, { status: 500 })
  }
}
