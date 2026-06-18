import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import {
  loadState,
  saveState,
  newId,
  buildWorkoutDraft,
  lastLogForExercise,
  loadProfile,
  saveProfile,
} from '../lib/storage.js'
import { getExercise } from '../data/exercises.js'

const DRAFT_KEY = 'nk_gym_v3_draft'

const WorkoutContext = createContext(null)

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function makeExerciseEntry(state, exerciseId) {
  const ex = getExercise(exerciseId)
  const prior = lastLogForExercise(state, exerciseId)
  const weight = prior ? prior.weight : ex.defaultWeight
  const reps = prior ? prior.reps : ex.defaultReps
  return {
    exerciseId,
    machine: ex.machine,
    sets: Array.from({ length: ex.sets }, () => ({ weight, reps, done: false })),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_WORKOUT':
      return { ...state, draft: buildWorkoutDraft(state, action.workoutType) }

    case 'DISCARD_DRAFT':
      return { ...state, draft: null }

    case 'UPDATE_DRAFT_SET': {
      if (!state.draft) return state
      const exercises = state.draft.exercises.map((e, i) =>
        i !== action.exIndex
          ? e
          : {
              ...e,
              sets: e.sets.map((s, j) =>
                j !== action.setIndex ? s : { ...s, ...action.patch },
              ),
            },
      )
      return { ...state, draft: { ...state.draft, exercises } }
    }

    case 'SWAP_DRAFT_EXERCISE': {
      if (!state.draft) return state
      const exercises = state.draft.exercises.map((e, i) =>
        i !== action.exIndex ? e : makeExerciseEntry(state, action.newExerciseId),
      )
      return { ...state, draft: { ...state.draft, exercises } }
    }

    case 'FINISH_WORKOUT': {
      if (!state.draft) return state
      const startedAt = state.draft.startedAt || state.draft.date
      const endedAt = new Date().toISOString()
      const durationSec = Math.max(0, Math.round((new Date(endedAt) - new Date(startedAt)) / 1000))
      const session = { id: newId(), ...state.draft, endedAt, durationSec }
      return { ...state, sessions: [session, ...state.sessions], draft: null }
    }

    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.patch } }

    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.id),
      }

    case 'UPDATE_SESSION_SET': {
      const sessions = state.sessions.map((s) =>
        s.id !== action.sessionId
          ? s
          : {
              ...s,
              exercises: s.exercises.map((e, i) =>
                i !== action.exIndex
                  ? e
                  : {
                      ...e,
                      sets: e.sets.map((set, j) =>
                        j !== action.setIndex ? set : { ...set, ...action.patch },
                      ),
                    },
              ),
            },
      )
      return { ...state, sessions }
    }

    case 'REMOVE_SESSION_EXERCISE': {
      const sessions = state.sessions
        .map((s) =>
          s.id !== action.sessionId
            ? s
            : { ...s, exercises: s.exercises.filter((_, i) => i !== action.exIndex) },
        )
        .filter((s) => s.exercises.length > 0)
      return { ...state, sessions }
    }

    default:
      return state
  }
}

function init() {
  const persisted = loadState()
  return { sessions: persisted.sessions, draft: loadDraft(), profile: loadProfile() }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)

  // Persist sessions and the in-progress draft separately.
  useEffect(() => {
    saveState({ sessions: state.sessions })
  }, [state.sessions])

  useEffect(() => {
    try {
      if (state.draft) localStorage.setItem(DRAFT_KEY, JSON.stringify(state.draft))
      else localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* ignore */
    }
  }, [state.draft])

  useEffect(() => {
    saveProfile(state.profile)
  }, [state.profile])

  const value = useMemo(
    () => ({
      sessions: state.sessions,
      draft: state.draft,
      profile: state.profile,
      setProfile: (patch) => dispatch({ type: 'SET_PROFILE', patch }),
      startWorkout: (workoutType) => dispatch({ type: 'START_WORKOUT', workoutType }),
      discardDraft: () => dispatch({ type: 'DISCARD_DRAFT' }),
      updateDraftSet: (exIndex, setIndex, patch) =>
        dispatch({ type: 'UPDATE_DRAFT_SET', exIndex, setIndex, patch }),
      swapDraftExercise: (exIndex, newExerciseId) =>
        dispatch({ type: 'SWAP_DRAFT_EXERCISE', exIndex, newExerciseId }),
      finishWorkout: () => dispatch({ type: 'FINISH_WORKOUT' }),
      deleteSession: (id) => dispatch({ type: 'DELETE_SESSION', id }),
      updateSessionSet: (sessionId, exIndex, setIndex, patch) =>
        dispatch({ type: 'UPDATE_SESSION_SET', sessionId, exIndex, setIndex, patch }),
      removeSessionExercise: (sessionId, exIndex) =>
        dispatch({ type: 'REMOVE_SESSION_EXERCISE', sessionId, exIndex }),
    }),
    [state.sessions, state.draft, state.profile],
  )

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext)
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider')
  return ctx
}
