import { createStore } from 'vuex'
import { Repo, User, Branch, Commit } from '@/types'
import axios from 'axios'
import api from '@/services/api'
import {
  serializeUser,
  serializeRepos,
  serializeBranches,
  serializeCommits,
  getRepoById,
  getBranchByName
} from '@/services/serializers'

export default createStore({
  state: {
    user: {} as User,
    repos: [] as Repo[],
    branches: [] as Branch[],
    commits: [] as Commit[],
    selectedRepo: {} as Repo,
    selectedBranch: {} as Branch,
    commitsPagination: {
      page: 1,
      perPage: 10
    }
  },
  mutations: {
    setUser(state, user: User) {
      state.user = user
    },
    setRepos(state, repos: Repo[]) {
      state.repos = repos
      state.commitsPagination.page = 1
    },
    setBranches(state, branches: Branch[]) {
      state.branches = branches
      state.selectedBranch = branches[0]
      state.commitsPagination.page = 1
    },
    setCommits(state, commits: Commit[]) {
      state.commits = commits
      state.commitsPagination.page = 1
    },
    updateCommits(state, commits: Commit[]) {
      if (commits && commits.length) {
        state.commits = [...state.commits, ...commits]
      }
    },
    setCommitsPagination(state, { page, perPage }) {
      if (page) state.commitsPagination.page = page
      if (perPage) state.commitsPagination.perPage = perPage
    }
  },
  actions: {
    async exchangeToken({ dispatch }, code) {
      // 👉🏻 https://github.com/isaacs/github/issues/330
      // 👉🏻 https://github.com/Freeboard/thingproxy we can use this temporary/simple solution (as this a test not a real app)
      const thingproxyUrl = 'https://thingproxy.freeboard.io/fetch'
      const params = `code=${code}&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`
      const accessTokenUrl = `${thingproxyUrl}/https://github.com/login/oauth/access_token/?${params}`

      const requestedData = await axios.post(accessTokenUrl)

      // requestedData => access_token=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&scope=&token_type=bearer
      const accessToken = requestedData.data.split('=')[1].split('&')[0]

      if (accessToken.includes('bad_verification_code')) {
        throw new Error('Bad verification code')
      } else {
        localStorage.setItem('accessToken', accessToken)
        api.defaults.headers.common['Authorization'] = `bearer ${accessToken}`
        dispatch('fetchUser')
      }
    },
    async fetchUser({ commit, dispatch }) {
      try {
        const user = await api.get(`/user`)
        commit('setUser', serializeUser(user.data))
        dispatch('fetchRepos')
      } catch (error) {
        console.error(error)
      }
    },
    async fetchRepos({ commit, state }) {
      try {
        const { data } = await api.get(`/users/${state.user.login}/repos`)
        commit('setRepos', serializeRepos(data))
      } catch (error) {
        console.error(error)
      }
    },
    async fetchBranches({ commit, dispatch, state }, repo: Repo) {
      try {
        const { data } = await api.get(`/repos/${repo.full_name}/branches`)
        commit('setBranches', serializeBranches(data))
        if (state.branches && state.branches.length) {
          // select and return the first branch by default
          dispatch('fetchCommits', { repo_id: repo.id, branch_name: state.branches[0].name })
          return state.branches[0].name
        } else {
          commit('setCommits', [])
        }
      } catch (error) {
        console.error(error)
      }
    },
    async fetchCommits({ commit, state }, { repo_id, branch_name, paginated = false }) {
      paginated
        ? commit('setCommitsPagination', { page: state.commitsPagination.page + 1 })
        : commit('setCommitsPagination', { page: 1 })

      const { commitsPagination, user } = state
      const { page, perPage } = commitsPagination
      const selectedRepo = getRepoById(state.repos, repo_id)
      const selectedBranch = getBranchByName(state.branches, branch_name)
      try {
        if (!!selectedRepo || !!selectedBranch) {
          const { data } = await api.get(
            `/repos/${user.login}/${selectedRepo?.name}/commits?sha=${selectedBranch?.commit.sha}&page=${page}&per_page=${perPage}`
          )
          paginated
            ? commit('updateCommits', serializeCommits(data))
            : commit('setCommits', serializeCommits(data))
        } else {
          commit('setCommits', [])
          throw new Error('Repo or branch not found')
        }
      } catch (error: any) {
        console.error(error)
        commit('setCommits', [])
        if (error.response?.status === 409) {
          commit('setBranches', [])
        }
      }
    }
  }
})
