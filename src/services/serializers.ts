import { Repo, User, Branch, Commit } from '@/types'
import moment from 'moment'

// user
export const serializeUser = (user: User): User => {
  return { id: user.id, login: user.login, avatar_url: user.avatar_url }
}

// single repo
export const serializeRepo = (repo: Repo): Repo => {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    owner: { avatar_url: repo.owner.avatar_url, id: repo.owner.id, login: repo.owner.login }
  }
}

// single branch
export const serializeBranch = (branch: Branch): Branch => {
  return {
    name: branch.name,
    commit: { sha: branch.commit.sha, url: branch.commit.url }
  }
}

// single commit
export const serializeCommit = (commit: Commit): Commit => {
  return {
    sha: commit.sha,
    commit: {
      committer: {
        date: `committed ${moment(commit.commit.committer.date).fromNow()}`,
        name: commit.commit.committer.name
      },
      author: {
        name: commit.commit.author.name,
        avatar_url: commit.author.avatar_url,
        login: commit.author.login
      },
      message: commit.commit.message
    }
  }
}

// multiple repos
export const serializeRepos = (repos: Repo[]): Repo[] => {
  return repos && repos.length ? repos.map(serializeRepo) : []
}

// multiple branches
export const serializeBranches = (branches: Branch[]): Branch[] => {
  return branches && branches.length ? branches.map(serializeBranch) : []
}

// multiple commits
export const serializeCommits = (commits: Commit[]): Commit[] => {
  return commits && commits.length ? commits.map(serializeCommit) : []
}

// get branch by name
export const getBranchByName = (branches: Branch[], name: any): Branch | undefined => {
  return branches.find(branch => branch.name === name)
}

// get repo by id
export const getRepoById = (repos: Repo[], id: any): Repo | undefined => {
  return repos.find(repo => String(repo.id) === String(id))
}
