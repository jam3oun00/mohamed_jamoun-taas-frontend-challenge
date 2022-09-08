# mohamed_jamoun-taas-frontend-challenge

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

## Brief about the project

In this small test project, a user can authorize their GitHub account using the [GitHub API](https://docs.github.com/en/rest).  
He will be able to see a list of his repositories, and also can search using the top input field.  
Also, user will be able to select the repo and list all branches and commits related to the selected branch in the selection box, with infinite scrolling.

### structure

The structure is very simple.
We haven't chance to use these folders:

- [src/assets]: project didn't require any of the assets
- [src/store]: the project is very small and simple with only two pages, i was following the YAGNI software engineering principle

### Technologies

Technologies used in this project as follows:

- yarn
- webpack
- vue.js v3
- typescript
- tailwindCSS v3
- github API
- SCSS

### challenges

The only challenge I had in this project was the [CORS issue]() when trying to exchange code with access_token (https://github.com/login/oauth/access_token)
The only solution I can think of is to use the backend, but I tried another temporary/simple solution that is [thingproxy](https://github.com/Freeboard/thingproxy)
For the other API endpoints, there was no issues at all
