import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'

import Posts, { getStaticProps } from '../../pages/posts'
import { PrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'new-test-post',
    title: 'New Test Post',
    excerpt: 'Post excerpt',
    updatedAt: 'February 23, 2022',
  },
]

describe('Posts page', () => {
  it('should render correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('New Test Post')).toBeInTheDocument()
    expect(screen.getByText('Post excerpt')).toBeInTheDocument()
    expect(screen.getByText('February 23, 2022')).toBeInTheDocument()
  })

  it('should load initial data', async () => {
    const PrismicClientMocked = mocked(PrismicClient)
    PrismicClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([
        {
          uid: 'fake-new-post',
          data: {
            title: [{ type: 'heading', text: 'Fake New Post' }],
            content: [{ type: 'paragraph', text: 'Post excerpt' }],
          },
          last_publication_date: '2022-02-23T23:59:50.984Z',
        },
      ]),
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'fake-new-post',
              title: 'Fake New Post',
              excerpt: 'Post excerpt',
              updatedAt: 'February 23, 2022',
            },
          ],
        },
      })
    )
  })
})
