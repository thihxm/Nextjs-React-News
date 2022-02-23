import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import SubscribeButton from '.'

jest.mock('next-auth/react')

jest.mock('next/router')

describe('SubscribeButton component', () => {
  it('should render correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    })

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('should redirect user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession)
    const signInMocked = mocked(signIn)

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated',
    })

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('should redirect to posts when user already has a subscription', () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        expires: 'fake-expires',
        user: {
          email: 'thiago@test.com',
          name: 'Thiago Medeiros',
          image: null,
        },
        activeSubscription: 'fake-active-subscription',
      },
      status: 'authenticated',
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})
