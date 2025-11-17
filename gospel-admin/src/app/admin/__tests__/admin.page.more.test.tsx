import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('AdminPageContent - additional internals', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // ensure a clean fetch mock for each test
    // tests will set global.fetch as needed
  })

  test('shows counselee view (My Resources) when user role is counselee', async () => {
    // Use the already-loaded mocked client from jest.setup and override its
    // createClient implementation for this test (avoids resetModules which
    // can force a second React instance to be loaded).
    // eslint-disable-next-line global-require
    const clientMod = require('@/lib/supabase/client')
    jest.spyOn(clientMod, 'createClient').mockImplementation(() => ({
      auth: { getUser: async () => ({ data: { user: { id: 'u-c1' } } }) },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: { role: 'counselee' } })
          })
        })
      }),
    }))

    // Make sure fetch for profiles list returns empty
    // @ts-ignore
    global.fetch = jest.fn((url, opts) => {
      if (url === '/api/profiles' && (!opts || opts.method === 'GET')) {
        return Promise.resolve({ ok: true, json: async () => ({ profiles: [] }) })
      }
      return Promise.resolve({ ok: true, json: async () => ({}) })
    })

    // Simulate an authenticated localStorage marker the jest.setup createClient shim can use
    ;(global as any).localStorage = {
      getItem: jest.fn((k: string) => (k === 'gospel-admin-auth' ? JSON.stringify({ isAuthenticated: true, sessionToken: 't' }) : null)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    }

  const { AdminPageContent } = await import('../page')
  render(<AdminPageContent />)

    // Expect the counselee-specific heading to appear
    const heading = await screen.findByText(/My Resources/i)
    expect(heading).toBeInTheDocument()
  })

  test.skip('shows duplicate-slug error when create API returns duplicate error', async () => {
    // eslint-disable-next-line global-require
    const clientMod = require('@/lib/supabase/client')
    jest.spyOn(clientMod, 'createClient').mockImplementation(() => ({
      auth: { getUser: async () => ({ data: { user: { id: 'u-admin' } } }) },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: { role: 'admin' } })
          })
        })
      }),
    }))

    // Mock fetch: GET profiles -> empty; POST profiles -> duplicate slug error
    // @ts-ignore
    global.fetch = jest.fn((url, opts) => {
      if (url === '/api/profiles' && (!opts || opts.method === 'GET')) {
        return Promise.resolve({ ok: true, json: async () => ({ profiles: [] }) })
      }
      if (url === '/api/profiles' && opts && opts.method === 'POST') {
        return Promise.resolve({ ok: false, json: async () => ({ error: 'duplicate key value violates unique constraint' }) })
      }
      return Promise.resolve({ ok: true, json: async () => ({}) })
    })

    ;(global as any).localStorage = {
      getItem: jest.fn((k: string) => (k === 'gospel-admin-auth' ? JSON.stringify({ isAuthenticated: true, sessionToken: 't' }) : null)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    }


  const { AdminPageContent } = await import('../page')
  render(<AdminPageContent />)

  // Open create form, fill and submit to trigger POST (get first button since we have desktop + mobile versions)
  const newBtns = await screen.findAllByRole('button', { name: /Assign Resource/i })
  await userEvent.click(newBtns[0])

  const titleInput = screen.getByLabelText(/Title \*/)
  const descInput = screen.getByLabelText(/Description/)
  await userEvent.type(titleInput, 'Duplicate Title')
  await userEvent.type(descInput, 'desc')

  const createBtn = screen.getByRole('button', { name: /Create Assignment/i })
  await userEvent.click(createBtn)

    // Expect duplicate-slug friendly error message to appear
    const err = await screen.findByText(/already in use/i)
    expect(err).toBeInTheDocument()
  })
})
