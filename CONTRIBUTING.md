# Contributing to r3f-next-starter

Thank you for considering contributing to r3f-next-starter! This document outlines the process for contributing to the project.

---

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/r3f-next-starter.git
   cd r3f-next-starter
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Workflow

### Running the Development Server

```bash
pnpm dev
```

This starts the development server with HTTPS at `https://localhost:3000`.

### Code Style

- Run **ESLint** before committing:
  ```bash
  pnpm lint
  ```
- Run **Prettier** to format code:
  ```bash
  pnpm prettier:fix
  ```

### Creating Components

Use the built-in generators to maintain consistency:

```bash
# Create a new sandbox
pnpm new:sandbox

# Create a new component (canvas or DOM)
pnpm new:component
```

---

## Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Follow the existing code style** and patterns
3. **Write meaningful commit messages**
4. **Test your changes** thoroughly
5. **Create a pull request** with a clear description

### PR Title Format

Use conventional commit format for PR titles:

- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update README`
- `refactor: Refactor component structure`
- `chore: Update dependencies`

---

## Code Guidelines

### TypeScript

- Use explicit types for function parameters and return values
- Prefer interfaces for object shapes
- Use proper types for Three.js refs (e.g., `useRef<THREE.Mesh>(null)`)

### React Three Fiber

- All R3F components must have `'use client'` directive
- Use `useFrame` for animations, not `requestAnimationFrame`
- Wrap lazy-loaded 3D content in `<Suspense>`
- Use drei helpers when available

### File Organization

- Canvas (3D) components: `src/components/canvas/`
- DOM (2D) components: `src/components/dom/`
- Full scenes: `src/sandboxes/`
- Hooks: `src/hooks/`
- Config: `src/config/`

---

## Reporting Issues

### Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and OS information
- Screenshots or error messages if applicable

### Feature Requests

Include:
- Description of the feature
- Use case / motivation
- Proposed implementation (optional)

---

## Community

- Be respectful and inclusive
- Help others when you can
- Share knowledge and learnings

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

Open an issue or start a discussion on GitHub if you have questions about contributing.

