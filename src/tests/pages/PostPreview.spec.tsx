import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { PrismicClient } from '../../services/prismic'

jest.mock('next-auth/react')
jest.mock('next/router')
jest.mock('../../services/prismic')

const post = {
  slug: 'new-test-post',
  title: 'New Test Post',
  content: '<p>Post content</p>',
  updatedAt: 'February 23, 2022',
}

describe('Post Preview page', () => {
  it('should render correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: null,
      },
    } as any)

    render(<Post post={post} />)

    expect(screen.getByText('New Test Post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
    expect(screen.getByText('February 23, 2022')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('should redirect user to full post if user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription',
      },
    } as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/new-test-post')
  })

  it('should load initial data', async () => {
    const PrismicClientMocked = mocked(PrismicClient)

    PrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'New Test Post' }],
          content: [{ type: 'paragraph', text: 'Post content', spans: [] }],
        },
        last_publication_date: '2022-02-23T23:59:50.984Z',
      }),
    } as any)

    const response = await getStaticProps({
      params: {
        slug: 'new-test-post',
      },
    })

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'new-test-post',
            title: 'New Test Post',
            content: '<p>Post content</p>',
            updatedAt: 'February 23, 2022',
          },
        },
      })
    )
  })
})
