import type { Question } from '../types'
import { SIGN_QUESTIONS } from './signs'
import { REGLER } from './regler'
import { SAKERHET } from './sakerhet'
import { FORDON } from './fordon'
import { MILJO } from './miljo'
import { PERSON } from './person'

export const ALL_QUESTIONS: Question[] = [...REGLER, ...SIGN_QUESTIONS, ...SAKERHET, ...FORDON, ...MILJO, ...PERSON]
