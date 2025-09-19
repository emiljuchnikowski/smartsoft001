# Git Commit Instructions

This document provides guidelines for writing commit messages in this monorepo workspace that comply with our commitlint rules and follow conventional commit standards.

## Commit Message Format

All commit messages must follow the **Conventional Commits** specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Examples
```
feat(auth): add JWT token validation
fix(crud): resolve pagination bug in user list
docs(shared): update API documentation
chore(nx): update workspace dependencies
```

## Commit Types

Use one of the following commit types:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries
- **perf**: A code change that improves performance
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

## Available Scopes

The scope is **required** and must be one of the following:

### Package Scopes
- **auth** - Authentication related changes
- **crud** - CRUD operations and related functionality
- **shared** - Shared utilities and common functionality
- **trans** - Translation/internationalization features

### Infrastructure Scopes
- **nx** - Nx workspace configuration and tooling
- **github** - GitHub workflows, templates, and configuration
- **docker** - Docker configuration and containerization
- **release** - Release process and versioning

## Commit Message Rules

1. **Use lowercase** for type and scope
2. **No period** at the end of the description
3. **Start description with verb** in imperative mood (e.g., "add", "fix", "update")
4. **Keep description under 72 characters**
5. **Use present tense** ("add" not "added" or "adds")
6. **Include scope** - it's mandatory in this project

## Examples by Scope

### Authentication (auth)
```
feat(auth): implement OAuth2 login flow
fix(auth): resolve token expiration handling
test(auth): add unit tests for user validation
refactor(auth): simplify JWT middleware
```

### CRUD Operations (crud)
```
feat(crud): add soft delete functionality
fix(crud): correct filtering in search endpoint
perf(crud): optimize database queries
docs(crud): update API endpoint documentation
```

### Shared Utilities (shared)
```
feat(shared): add new validation utilities
fix(shared): resolve type definitions export
refactor(shared): improve error handling helpers
style(shared): format code according to eslint rules
```

### Translation (trans)
```
feat(trans): add support for new language
fix(trans): correct missing translation keys
chore(trans): update translation files
```

### Infrastructure
```
chore(nx): update workspace to latest version
ci(github): add automated testing workflow
build(docker): optimize container build process
chore(release): prepare version 2.1.0
```

## Breaking Changes

For breaking changes, add `!` after the type/scope and include `BREAKING CHANGE:` in the footer:

```
feat(auth)!: change user authentication flow

BREAKING CHANGE: The authentication API now requires OAuth2 instead of basic auth
```

## Multi-line Commits

For complex changes, use the body to explain what and why:

```
feat(crud): implement advanced filtering system

Add support for complex queries with multiple conditions,
date ranges, and nested object filtering. This improves
the user experience when searching through large datasets.

Closes #123
```

## Issue References

Always include issue references when your commit is related to a specific issue, bug report, or feature request. This creates traceability and helps with project management.

### Supported Keywords

Use these keywords to automatically link and close issues:

**Closing Keywords** (will close the issue when merged):
- `Closes #123`
- `Fixes #123` 
- `Resolves #123`
- `Closes: #123`
- `Fixes: #123`
- `Resolves: #123`

**Reference Keywords** (will link but not close):
- `Refs #123`
- `References #123`
- `Related to #123`
- `See #123`

**Project-specific References**:
- `Refs FRA-123` - Reference to specific project issue identifiers
- `Refs FRA-*` - Use this format for project tracking system issues

### Examples with Issue References

```
feat(auth): add password reset functionality

Implement secure password reset flow with email verification
and temporary tokens that expire after 1 hour.

Closes #456
Refs FRA-789
```

```
fix(crud): resolve data validation error

Fix issue where special characters in user input caused
validation to fail incorrectly.

Fixes #789
Refs FRA-234
```

```
refactor(shared): improve error handling

Centralize error handling logic and add better error messages
for improved debugging experience.

Related to #234
Refs FRA-567
```

### Multiple Issues

You can reference multiple issues in a single commit:

```
feat(auth): implement social login

Add support for Google and Facebook OAuth login.
Includes proper error handling and user data mapping.

Closes #123
Closes #124
Refs FRA-456
Refs FRA-457
```

### Issue Reference Rules

1. **Place references in the footer** (after the body)
2. **Use specific keywords** for automatic issue management
3. **Include context** when referencing multiple issues
4. **One reference per line** for clarity
5. **Use issue numbers** from your issue tracking system

### GitHub Integration

When using GitHub, issue references will:
- Automatically link commits to issues
- Close issues when using closing keywords
- Create cross-references in issue comments
- Help track progress in project boards

## Common Mistakes to Avoid

❌ **Wrong:**
```
Fix bug
Update code
feat: add feature
fix(): resolve issue
feat(wrong-scope): add something
```

✅ **Correct:**
```
fix(auth): resolve login validation bug
feat(crud): add pagination to user list
docs(shared): update installation guide
chore(nx): upgrade dependencies
```

## Validation

All commits are automatically validated using commitlint. If your commit message doesn't follow these rules, the commit will be rejected.

## Tools Integration

This workspace uses:
- **Commitlint** for commit message validation
- **Conventional Commits** for standardized format
- **Semantic Release** for automated versioning

Following these guidelines ensures proper:
- Automated changelog generation
- Semantic versioning
- Clear project history
- Better collaboration
