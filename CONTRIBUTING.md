# Contributing Guidelines

Thank you for contributing to the Activity Feed Application! This document outlines our development practices and submission guidelines.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow all guidelines in good faith

## 🔄 Development Workflow

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/assignment.git
cd assignment
npm install
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive names:

- `feature/infinite-scroll` ✅
- `fix/duplicate-activities` ✅
- `docs/update-readme` ✅
- `f1` ❌
- `fix` ❌

### 3. Make Changes

Follow our code standards (see [DEVELOPMENT.md](./DEVELOPMENT.md#-code-standards))

```javascript
// ✅ Good
const fetchActivities = async (cursor, filter) => {
  const params = new URLSearchParams({ limit: 20 });
  // Implementation
};

// ❌ Avoid
const fetch_activities = async (cursor, filter) => {
  // Implementation
};
```

### 4. Test Your Changes

```bash
# Start all services
npm run dev

# Test manually in browser
# Check console for errors
# Verify functionality works

# Run linting
npm run lint
```

### 5. Commit Changes

Write clear, descriptive commit messages:

```bash
git commit -m "feat: add real-time activity polling

- Poll for new activities every 10 seconds
- Prevent duplicate items with deduplication logic
- Update UI with new activities in real-time

Closes #123"
```

**Commit Message Format:**

```
<type>: <subject>

<body>

<footer>
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (no logic changes)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Tests
- `chore` - Build/dependencies

### 6. Push & Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create PR on GitHub with:

- Clear description of changes
- Link to related issues (#123)
- Screenshots if UI changes
- Testing steps

## 🧪 Testing

### Manual Testing Checklist

**Frontend:**

- [ ] Activities load correctly
- [ ] Infinite scroll works
- [ ] Filtering works
- [ ] Creating activity works
- [ ] Optimistic UI updates appear
- [ ] No console errors
- [ ] Responsive on mobile

**Backend:**

- [ ] API endpoints respond
- [ ] Pagination works
- [ ] Filtering works
- [ ] Database queries are fast
- [ ] No unhandled errors
- [ ] Logs are clear

### API Testing with curl

```bash
# Get activities
curl http://localhost:3000/api/activities \
  -H "x-tenant-id: company-abc"

# Create activity
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: company-abc" \
  -d '{
    "actorId": "user-001",
    "actorName": "Test",
    "type": "like",
    "entityId": "post-123",
    "metadata": {}
  }'
```

## 📝 Documentation

When adding features, update:

1. **Code Comments** - For complex logic
2. **README.md** - For user-facing changes
3. **API Documentation** - For endpoint changes
4. **DEVELOPMENT.md** - For developer setup changes

Example documentation:

```javascript
/**
 * Fetch activities with pagination support
 * @param {string} cursor - Pagination cursor from previous request
 * @param {string} filter - Activity type filter ('like', 'comment', 'share')
 * @returns {Promise<{data: Array, nextCursor: string}>} Activities and next cursor
 * @throws {Error} If fetch fails
 */
const fetchActivities = async (cursor, filter) => {
  // Implementation
};
```

## 🎨 Code Style

### JavaScript

```javascript
// ✅ Use const/let, not var
const MAX_LIMIT = 100;
let currentPage = 1;

// ✅ Use arrow functions
const getValue = () => {};

// ✅ Use async/await, not .then()
const data = await fetchData();

// ✅ Use template literals
const message = `Hello, ${name}!`;

// ✅ Destructure objects
const { data, error } = response;

// ✅ Use optional chaining
const value = obj?.property?.subproperty;

// ✅ Use nullish coalescing
const result = value ?? defaultValue;
```

### React

```jsx
// ✅ Use functional components
const MyComponent = () => {
  return <div>Content</div>;
};

// ✅ Use hooks for state and effects
const [data, setData] = useState([]);
useEffect(() => {}, []);

// ✅ Use proper naming
const handleClick = () => {};
const isLoading = false;
const onSubmit = () => {};

// ✅ Use fragment shorthand
return (
  <>
    <Header />
    <Main />
    <Footer />
  </>
);
```

## 🐛 Bug Reports

When reporting bugs, include:

1. **Description**: Clear summary of the bug
2. **Reproduction Steps**:
   - Step 1
   - Step 2
   - Step 3
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots/Logs**: Error messages, network logs
6. **Environment**:
   - OS (Windows/Mac/Linux)
   - Node version
   - Browser (if frontend issue)

Example:

```markdown
## Bug: Activities not loading

### Description

When I click "All" filter, activities fail to load.

### Reproduction

1. Open the app
2. Click the "comment" filter
3. Click the "All" filter
4. Observe: Activities don't load

### Expected

Activities should load normally

### Actual

Blank screen, console shows "data is not defined"

### Environment

- Windows 11
- Node v18.16.0
- Chrome 115
```

## 🎯 Feature Requests

When suggesting features, include:

1. **Use Case**: Why is this needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other possible approaches
4. **Additional Context**: Any relevant info

Example:

```markdown
## Feature: Dark mode support

### Use Case

Users working at night need a dark theme to reduce eye strain.

### Proposed Solution

Add CSS variable overrides based on `prefers-color-scheme`

- Light mode (default)
- Dark mode (from system preference)
- Toggle button in settings

### Alternatives

Could use CSS media query only without toggle.

### Additional Context

See popular dark mode implementations in similar apps.
```

## 📋 Review Process

### Before Submitting PR

- [ ] Code follows style guide
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### Review Checklist

Reviewers will check:

- [ ] Code quality and style
- [ ] Functionality works correctly
- [ ] Performance impact
- [ ] Security concerns
- [ ] Test coverage
- [ ] Documentation completeness

### Addressing Feedback

1. Make requested changes
2. Commit with message like: `fix: address review feedback`
3. Push changes (don't force push)
4. Reply to reviewer comments

## 🚀 Release Process

1. Version bumping (semantic versioning)
2. Update CHANGELOG
3. Create release tag
4. Build production bundle
5. Deploy to production

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

## ❓ Questions?

- Check existing issues and PRs
- Read documentation
- Ask in discussions
- Open a new issue for clarification

---

Thank you for contributing! 🙌
