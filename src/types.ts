export type Lang = 'sv' | 'en'
export type Cat = 'regler' | 'skyltar' | 'sakerhet' | 'fordon' | 'miljo' | 'person'
export type Mode = 'exam' | 'study' | 'test'

export interface QText {
  q: string
  a: string[]
  e: string
}

export interface Question {
  id: string
  cat: Cat
  /** index into a[] of the correct option (same index in both languages) */
  correct: number
  /** optional sign image filename under /signs */
  sign?: string
  sv: QText
  en: QText
}

/** A question prepared for display: option order shuffled. */
export interface Prepared {
  q: Question
  /** order[i] = original option index shown at position i */
  order: number[]
}

export const CATS: Cat[] = ['regler', 'skyltar', 'sakerhet', 'fordon', 'miljo', 'person']

/** Approximate share of the 70 exam questions per area. */
export const EXAM_MIX: Record<Cat, number> = {
  regler: 22,
  skyltar: 10,
  sakerhet: 16,
  fordon: 9,
  miljo: 6,
  person: 7,
}

export const EXAM_TOTAL = 70
export const EXAM_PASS = 56 // 80 %, same ratio as Trafikverket's 52 of 65
export const EXAM_SECONDS = 50 * 60
