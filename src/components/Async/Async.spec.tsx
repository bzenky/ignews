import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { Async } from '.'

test('renders correctly', async () => {
    render(<Async />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(await screen.findByText('Add Button')).toBeInTheDocument()

    await waitFor(() => {
        return expect(screen.getByText('Add Button')).toBeInTheDocument()
    })

    // await waitForElementToBeRemoved(screen.queryByText('Remove Button'))

    await waitFor(() => {
        return expect(screen.queryByText('Remove Button')).not.toBeInTheDocument()
    })
})