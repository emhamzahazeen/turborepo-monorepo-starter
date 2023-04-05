# Contributing to the Configs

### Linting

```
npm run lint
```

#### Gotchas

When using Webstorm there might be problem that the bash execution environment has incorrect nvm path, try the following:

```
~/.bashrc
---------------------------
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18
```

```
~/.huskyr
--------------------------
source ~/.bashrc
```

This project follows the ideas of the [conventional commits specification](https://www.conventionalcommits.org/).
This provides an easy set of types/rules for creating an explicit commit history which makes it easier to write automated
tools on top of, e.g. automated releases or changelogs.

## Types

The following types are to be used for both branches and commit messages.

- `feat` (= feature)
- `fix` (= bugfix)
- `docs` (= documentation)
- `style` (= formatting or code style adjustment)
- `refactor` (= refactoring; neither fixes a bug nor adds a feature)
- `test` (= implementation of missing or adjustments of existing tests)
- `chore` (= generic maintenance)

## Branching Strategy

The project uses [gitlab-flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html) as branching strategy.

Each change is implemented within its own branch, forking off the `main` branch and following the naming pattern below.
This way, changes are applied only after a (code) review.

Naming pattern: `<category>/<jira-story-id>/<subject>` (e.g. _feature/msc-01/user-registration_).

Example categories:

- feature
- improvement
- bugfix
- ops
- release
- hotfix

Example: `feature/gaia-1/setup-monorepo`.

## Commits

Changes are made within the branch using small and clear commits. Commits are supposed to encapsulate related code changes
and to have commit messages that reflect a short summary of the changes made in natural language. It’s highly recommended to
push branches and their commits to the origin server every once in a while.

Commit messages are supposed to be structured according to the following pattern.

```plain
<type>(jira-epic-id): [jira-story-id][optional jira-subtask-id] | <subject>

<optional body>

<optional footer(s)>
```

Example:

```
feat(gh-gaia-1): [gh-gaia-2][gh-gaia-4] | add editor config

enabled consistent editor configuration via .editorconfig
```

### `<type>` (required)

(see aforementioned list)

### `<scope>` (required)

Name of the affected module.

### `<subject>` (required)

- English
- Imperative, present tense (= »change« instead of »changed» or »changes«)
- Short description (~50 characters is the soft limit)
- First letter is lowercase
- Skip the full stop (`.`)

Tip: always think about this sentence following the prelude »_apply this commit to [your subject here]_«

### `<body>` (optional)

- English
- Imperative, present tense (= »change« instead of »changed» or »changes«)
- Motivation for the change
- Contrasts its implementation with previous behavior

### `<footer>` (optional)

- Emphasize breaking changes
  - Short description of the change
  - Justification
  - Migration notes
  - Examples of states before and after the change

## Releases / Publishing

Using aforementioned semantic commit messages, we’re automating the process of releasing/publishing the npm packages of
this repository. Thus the last commit message decides whether the new release will be a major, minor, or patch release, so
think carefully about it and don’t commit a breaking change as minor.

## Rebasing

Before opening a merge request, all changes shall be rebased onto the target branch first. Rebasing moves the entire feature
branch to begin on the tip of the target branch, effectively incorporating all the new commits into/onto it. However, instead
of using a merge commit, rebasing re-writes the Git history by creating brand new commits for each commit in the original branch.

```sh
git pull --rebase origin main
```

Rebasing may cause merge conflicts that require manual resolving. As soon as a conflict is resolved and the affected files are
added to the index/stage, the rebasing can be continued.

```sh
git rebase --continue
```

In case commits have been pushed before getting rebased, future pushes won’t be accepted by the remote server anymore as Git is
not able to reproduce the correlation of the local commits and the remote commits. Thus, a forceful push is required.

```sh
git push -f origin feat/button
```

Force pushes override the remote branch completely. Any changes made on the remote branch may be overwritten and lost completely.
Especially when working together with other co-workers within the same branch, this may cause lost code and requires special
attention of all involved parties.

After the rebasing is completed, the merge request to the target branch may be created.

## Merge Requests

Merge requests onto `main` are reviewed and merged by the core team, not the contributors themselves. This ensures that the agreed
common standards are adhered to. As soon as a merge onto `main` is completed, a new release is built and published to the registry.
