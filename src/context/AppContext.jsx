import { createContext, useContext, useReducer, useEffect } from 'react'
import { fetchSubjects, fetchTasks, fetchNotes } from '../services/api'

const AppContext = createContext()

const initialState = {
  subjects: [],
  tasks: [],
  notes: [],
  isLoading: false,
  error: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, isLoading: true, error: null }
    
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        [action.dataType]: action.payload,
        error: null
      }
    
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload }
    
    case 'ADD_SUBJECT':
      return { ...state, subjects: [...state.subjects, action.payload] }
    
    case 'REMOVE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.filter(subject => subject.id !== action.payload),
        tasks: state.tasks.filter(task => task.subjectId !== action.payload),
        notes: state.notes.filter(note => note.subjectId !== action.payload)
      }
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        )
      }
    
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      }
    
    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] }
    
    case 'REMOVE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  useEffect(() => {
    async function loadInitialData() {
      dispatch({ type: 'FETCH_REQUEST' })
      try {
        // Load subjects
        const subjectsData = await fetchSubjects()
        dispatch({ type: 'FETCH_SUCCESS', dataType: 'subjects', payload: subjectsData })
        
        // Load tasks
        const tasksData = await fetchTasks()
        dispatch({ type: 'FETCH_SUCCESS', dataType: 'tasks', payload: tasksData })
        
        // Load notes
        const notesData = await fetchNotes()
        dispatch({ type: 'FETCH_SUCCESS', dataType: 'notes', payload: notesData })
      } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: error.message })
      }
    }
    
    loadInitialData()
  }, [])
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}