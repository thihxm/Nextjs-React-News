import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/react'
import { SignInButton } from '.'

jest.mock('next-auth/react')

describe('SignInButton component', () => {
  it('should render correctly when user is not authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    })

    render(<SignInButton />)

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })

  it('should render correctly when user is authenticated', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        expires: 'fake-expires',
        user: {
          email: 'thiago@test.com',
          name: 'Thiago Medeiros',
          image: null,
        },
      },
      status: 'authenticated',
    })

    render(<SignInButton />)

    expect(screen.getByText('Thiago Medeiros')).toBeInTheDocument()
  })
})
