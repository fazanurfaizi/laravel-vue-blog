import { getters, mutations, actions } from '@/store/modules/auth'
import flushPromises from 'flush-promises'
import { sendPasswordResetLink, resetPassword } from '@/api/auth'

jest.mock('@/api/auth')
jest.mock('@/plugins/vue-authenticator')

describe('auth store module', () => {
    let state

    beforeEach(() => {
        state = {
            isAuthenticated: false,
            user: null,
            token: null
        }
    })

    describe('getters', () => {
        it('isAuthenticated logic works', () => {
            expect(getters.isAuthenticated(state)).toBe(false)
            state.isAuthenticated = true
            expect(getters.isAuthenticated(state)).toBe(true)
        })
        it('can get token', () => {
            expect(getters.getToken(state)).toBe(null)
            state.token = 'xxx-xxx-xxx'
            expect(getters.getToken(state)).toBe('xxx-xxx-xxx')
        })
        it('can get auth user', () => {
            expect(getters.authUser(state)).toBe(null)
            state.user = {name: 'foo'}
            expect(getters.authUser(state)).toEqual({name: 'foo'})
        })
    })

    describe('mutations', () => {
        it('set is authenticated', () => {
            mutations.IS_AUTHENTICATED(state, {isAuthenticated: true})
            expect(state.isAuthenticated).toBe(true)
        })
        it('set token', () => {
            mutations.SET_AUTH_TOKEN(state, 'xxx-xxx-xxx')
            expect(state.token).toBe('xxx-xxx-xxx')
        })
        it('set authenticated user', () => {
            const user ={name: 'foo', email: 'foo@bar.com'};
            mutations.SET_AUTH_USER(state, user)
            expect(state.user).toBe(user)
        })
    })

    describe('actions', () => {
        it('login using a social account', async () => {
            const commit = jest.fn()

            await actions.socialLogin({ commit }, 'github')

            expect(commit).toHaveBeenCalledWith("IS_AUTHENTICATED", {isAuthenticated: true})
            expect(commit).toHaveBeenCalledWith('SET_AUTH_USER', 'mocked user')
            expect(commit).toHaveBeenCalledWith('SET_AUTH_TOKEN', 'mocked token')
        })

        it('can login using email', async () => {
            const commit = jest.fn()

            await actions.login({ commit }, {email: 'foo@bar.com', password: '@secret123'})

            expect(commit).toHaveBeenCalledWith("IS_AUTHENTICATED", {isAuthenticated: true})
            expect(commit).toHaveBeenCalledWith('SET_AUTH_USER', 'mocked user object')
            expect(commit).toHaveBeenCalledWith('SET_AUTH_TOKEN', 'mocked token')
        })

        it('user can register using personal details', async () => {
            const commit = jest.fn()

            await actions.register({ commit }, {foo: 'bar'})

            expect(commit).toHaveBeenCalledWith("IS_AUTHENTICATED", {isAuthenticated: true})
            expect(commit).toHaveBeenCalledWith('SET_AUTH_USER', 'mocked user object')
            expect(commit).toHaveBeenCalledWith('SET_AUTH_TOKEN', 'mocked token')
        })

        it('can logout authenticated users', async () => {
            const commit = jest.fn()
            await actions.logout({ commit })

            expect(commit).toHaveBeenCalledWith("IS_AUTHENTICATED", {isAuthenticated: false})
            expect(commit).toHaveBeenCalledWith('SET_AUTH_USER', null)
            expect(commit).toHaveBeenCalledWith('SET_AUTH_TOKEN', null)
        })

        it('user can send forget password email', async () => {
            const commit = jest.fn()
            await actions.sendPasswordResetLink({ commit }, {foo: 'bar'})

            expect(sendPasswordResetLink.mock.calls).toHaveLength(1)
        })

        it('user can reset password', async () => {
            const commit = jest.fn()
            await actions.resetPassword({ commit }, {foo: 'bar'})

            expect(resetPassword.mock.calls).toHaveLength(1)
        })
    })
})
