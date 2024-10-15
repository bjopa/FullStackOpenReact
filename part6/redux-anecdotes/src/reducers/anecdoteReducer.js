import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload
      return state.map((anecdote) =>
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { appendAnecdote, updateAnecdote, setAnecdotes } =
  anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdoteToChange = getState().anecdotes.find((a) => a.id === id)
    const updatedAnecdote = {
      ...anecdoteToChange,
      votes: anecdoteToChange.votes + 1,
    }
    const returnedAnecdote = await anecdoteService.update(id, updatedAnecdote)
    dispatch(updateAnecdote(returnedAnecdote))
  }
}

export default anecdoteSlice.reducer
