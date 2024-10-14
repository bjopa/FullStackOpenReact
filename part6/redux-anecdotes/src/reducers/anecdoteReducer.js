import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  {
    content: 'If it hurts, do it more often',
    id: '1',
    votes: 0,
  },
  {
    content: 'Adding manpower to a late software project makes it later!',
    id: '2',
    votes: 0,
  },
  {
    content:
      'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    id: '3',
    votes: 0,
  },
  {
    content:
      'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    id: '4',
    votes: 0,
  },
  {
    content: 'Premature optimization is the root of all evil.',
    id: '5',
    votes: 0,
  },
  {
    content:
      'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    id: '6',
    votes: 0,
  },
]

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    createAnecdote(state, action) {
      const content = action.payload
      state.push({
        content,
        id: getId(),
        votes: 0,
      })
    },
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find((a) => a.id === id)
      if (anecdoteToChange) {
        anecdoteToChange.votes += 1
      }
    },
  },
})

export const { createAnecdote, voteAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
