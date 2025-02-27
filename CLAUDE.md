# n8n-nodes-linewebhook Development Guide

## Build Commands
- `npm run build` - Build the project
- `npm run dev` - Run in watch mode during development
- `npm run lint` - Run ESLint
- `npm run lintfix` - Fix linting issues automatically
- `npm run format` - Format code with Prettier

## Code Style Guidelines
- **Typing**: Use strict TypeScript typing, avoid `any` when possible
- **Formatting**: 2-space tabs, single quotes, trailing commas in multiline
- **Components**: Implement n8n interfaces (ICredentialType, INodeType)
- **Error Handling**: Use NodeApiError for API errors
- **Naming**: PascalCase for classes, camelCase for variables/functions
- **Imports**: Group by external libraries, then internal files
- **Line SDK**: Use @line/bot-sdk for API interactions
- **Parameters**: Use type-safe parameter extraction from node context