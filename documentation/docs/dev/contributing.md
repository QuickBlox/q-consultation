---
sidebar_label: '💻 Contributing'
sidebar_position: 4
---

# Contributing

First off, thanks that you help us to make Q-Consultation Lite better.
Feedback and suggestions for improvement always welcome :)

Please note we have a [code of conduct](#code-of-conduct), please follow it in all your interactions with the project.

## Contributing Process

Once you've found an issue you'd like to work on, please follow these steps to make your contribution:

1. Comment on it and say you're working on that issue. This is to avoid conflicts with others also working on the issue.
2. Write your code and submit your pull request. Be sure to read and follow our [pull request guidelines](#pull-request-guidelines) and [code guidelines](#code-guidelines)!
3. Wait for code review and address any issues raised as soon as you can.

:::note A note on collaboration

We encourage people to collaborate as much as possible. We especially appreciate contributors reviewing each others pull requests, as long as you are [kind and constructive](https://medium.com/@otarutunde/comments-during-code-reviews-2cb7791e1ac7) when you do so.

:::

## Proposing a new Issue

If you want to work on something that there is no GitHub issue for, follow these steps:

1. Create a new GitHub issue associated with the relevant repository and propose your change there. Be sure to include implementation details and the rationale for the proposed change.
   - We are very reluctant to accept random pull requests without a related issue created first.
2. Wait for a project maintainer to evaluate your issue and decide whether it's something that we will accept a pull request for.
3. Once the project maintainer has approved the issue, you may start work on code as described in the "[Contribution process](#contributing-process)" section above.

## Pull Request Guidelines

Read and follow the contributing guidelines and code of conduct for the project.

- **Make A Branch**

  - Please create a separate branch for each issue that you're working on. Do not make changes to the default branch (e.g. `master`, `develop`) of your fork.

- **Push Your Code ASAP**

  - Push your code as soon as you can. Follow the "[early and often](https://www.worklytics.co/blog/commit-early-push-often/)" rule.
  - Make a pull request as soon as you can and **mark the title with a "[WIP]"**. You can create a [draft pull request](https://help.github.com/en/articles/about-pull-requests#draft-pull-requests).

- **Describe Your Pull Request**

  - Use the format specified in pull request template for the repository. **Populate the stencil completely** for maximum verbosity.
    - Tag the actual issue number by replacing `#[issue_number]` e.g. `#42`. This closes the issue when your PR is merged.
    - Tag the actual issue author by replacing `@[author]` e.g. `@issue_author`. This brings the reporter of the issue into the conversation.
    - Mark the tasks off your checklist by adding an `x` in the `[ ]` e.g. `[x]`. This checks off the boxes in your to-do list. The more boxes you check, the better.
  - Describe your change in detail. Too much detail is better than too little.
  - Describe how you tested your change.
  - Check the Preview tab to make sure the Markdown is correctly rendered and that all tags and references are linked. If not, go back and edit the Markdown.

- **Request Review**

  - Once your PR is ready, **remove the "[WIP]" from the title** and/or change it from a draft PR to a regular PR.
  - If a specific reviewer is not assigned automatically, please [request a review](https://help.github.com/en/articles/requesting-a-pull-request-review) from the project maintainer and any other interested parties manually.

- **Incorporating feedback**
  - If your PR gets a 'Changes requested' review, you will need to address the feedback and update your PR by pushing to the same branch. You don't need to close the PR and open a new one.
  - Be sure to **re-request review** once you have made changes after a code review.
  - Asking for a re-review makes it clear that you addressed the changes that were requested and that it's waiting on the maintainers instead of the other way round.

## Code Guidelines

Don't try to prematurely optimize your code, keep it readable and understandable. All code in any code-base should look like a single person typed it, even when many people are contributing to it. Strictly enforce the agreed-upon style.

[ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) are used to maintain the same code style in the project.

:::info

Prettier config: [.prettierrc](https://github.com/QuickBlox/q-consultation/blob/master/.prettierrc)

ESLint config:

- [API config](https://github.com/QuickBlox/q-consultation/blob/master/packages/api/.eslintrc)
- [Client config](https://github.com/QuickBlox/q-consultation/blob/master/packages/client/.eslintrc)
- [Provider config](https://github.com/QuickBlox/q-consultation/blob/master/packages/provider/.eslintrc)

:::

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.
