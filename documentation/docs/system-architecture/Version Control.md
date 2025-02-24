---
sidebar_position: 5
---

# Version Control

## Overview
We're managing Feedstack using GitHub.

Our repository consists of at least two parts:
* Docusaurus Documentation
* Visual Studio Code

## Branching
Branches are created based on the latest main branch commit.

Branches are based on groups of similar Jira issues. Currently, most of the branches consist of the user's preferred name, followed by a summary name of what is being updated.

## Branch Protection
We have 3 branch protection rules enabled on our GitHub that apply to the main branch:

* Require a pull request before merging
    - Require 1 comment of approval before merging
* Do not allow bypassing the above settings

## GitHub Actions

### Docusaurus Build
We use a GitHub Action on our main branch to build our Docusaurus project documentation. Docusaurus uses the text and configuration details from Markdown and JSON files to build an HTML-based documentation website.