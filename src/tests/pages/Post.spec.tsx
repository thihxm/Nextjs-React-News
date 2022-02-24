import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getSession } from 'next-auth/react'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { PrismicClient } from '../../services/prismic'

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

const post = {
  slug: 'new-test-post',
  title: 'New Test Post',
  content: '<p>Post content</p>',
  updatedAt: 'February 23, 2022',
}

describe('Post page', () => {
  it('should render correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('New Test Post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
    expect(screen.getByText('February 23, 2022')).toBeInTheDocument()
  })

  it('should redirect user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'new-test-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      })
    )
  })

  it('should load initial data', async () => {
    const getSessionMocked = mocked(getSession)
    const PrismicClientMocked = mocked(PrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any)

    PrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'Fake New Post' }],
          content: [{ type: 'paragraph', text: 'Post content', spans: [] }],
        },
        last_publication_date: '2022-02-23T23:59:50.984Z',
      }),
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'fake-new-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-new-post',
            title: 'Fake New Post',
            content: '<p>Post content</p>',
            updatedAt: 'February 23, 2022',
          },
        },
      })
    )
  })
})
