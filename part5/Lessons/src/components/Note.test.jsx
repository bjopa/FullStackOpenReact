import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'
import NoteForm from './NoteForm'

test('renders content', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  }

  const mockHandler = vi.fn()

  render(
    <Note
      note={note}
      toggleImportance={mockHandler}
    />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createNote = vi.fn()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByPlaceholderText('write note content here')
  const sendButton = screen.getByText('Save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  console.log(createNote.mock.calls)
})
