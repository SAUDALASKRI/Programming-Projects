# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup (install deps, generate Prisma client, run migrations)
npm run setup

# Development server (uses Turbopack)
npm run dev
# On Windows PowerShell, NODE_OPTIONS= syntax doesn't work — use cross-env instead:
npx cross-env NODE_OPTIONS='--require ./node-compat.cjs' next dev --turbopack

# Build for production
npm run build

# Lint
npm run lint

# Run all tests
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx

# Reset the database
npm run db:reset
```

## Architecture Overview

UIGen is a Next.js 15 (App Router) application where users describe React components in a chat interface and an AI (Claude via Vercel AI SDK) generates them with live preview.

### Core Data Flow

1. User sends a message → `POST /api/chat` (`src/app/api/chat/route.ts`)
2. The route streams a response from Claude using two tools: `str_replace_editor` (create/edit files) and `file_manager` (rename/delete)
3. Tool calls are streamed back to the client and handled by `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`)
4. The `VirtualFileSystem` (`src/lib/file-system.ts`) stores all generated files in memory (nothing written to disk)
5. `PreviewFrame` (`src/components/preview/PreviewFrame.tsx`) watches the VFS via `refreshTrigger` and re-renders the iframe using `createImportMap` + `createPreviewHTML` from `src/lib/transform/jsx-transformer.ts`
6. The JSX transformer uses `@babel/standalone` to transpile files in the browser, creates Blob URLs for each, and builds an `<script type="importmap">` that resolves imports. Third-party packages are served from `esm.sh`.

### Key Abstractions

- **`VirtualFileSystem`** (`src/lib/file-system.ts`): In-memory file tree with full CRUD, serialization/deserialization, and text-editor style commands (`viewFile`, `replaceInFile`, `insertInFile`). A singleton `fileSystem` is exported but the chat API always creates a fresh instance per request.
- **`FileSystemContext`** (`src/lib/contexts/file-system-context.tsx`): React context wrapping the VFS. Exposes `handleToolCall` which routes `str_replace_editor` and `file_manager` tool calls into VFS mutations, and provides a `refreshTrigger` counter to notify consumers of changes.
- **`ChatContext`** (`src/lib/contexts/chat-context.tsx`): Wraps Vercel AI SDK's `useChat`. On each tool call part received, it calls `handleToolCall` on the file system context to keep the VFS in sync with what the AI is doing.
- **AI tools**: `buildStrReplaceTool` (`src/lib/tools/str-replace.ts`) and `buildFileManagerTool` (`src/lib/tools/file-manager.ts`) are factory functions that close over a `VirtualFileSystem` instance to produce Vercel AI SDK tool definitions.

### Authentication

JWT-based auth via `jose` stored in an `httpOnly` cookie (`auth-token`). `src/lib/auth.ts` handles session creation/verification (server-side only via `server-only`). Middleware (`src/middleware.ts`) protects `/api/projects` and `/api/filesystem`. The app works without authentication; anonymous users can generate components but projects are only persisted for authenticated users.

### Database

Prisma with SQLite (`prisma/dev.db`). Generated client is output to `src/generated/prisma/`. Two models: `User` (email + bcrypt password) and `Project` (stores serialized VFS data and chat messages as JSON strings).

### Preview System

The preview iframe (`PreviewFrame`) uses `srcdoc` with an import map. Files are transpiled with Babel standalone and assigned Blob URLs. The entry point is `/App.jsx` (or falls back to `/App.tsx`, `/index.jsx`, etc.). Tailwind CSS is loaded in the preview via CDN (`cdn.tailwindcss.com`).

### AI Prompt Convention

All AI-generated projects must have a root `/App.jsx` as the entry point. Local file imports must use the `@/` alias (e.g. `import Foo from '@/components/Foo'`). Styles use Tailwind classes — no hardcoded styles, no HTML files.

### Running Without an API Key

The app runs without `ANTHROPIC_API_KEY`. In that case `src/lib/provider.ts` returns a mock provider that returns static code. `maxSteps` is reduced from 40 to 4 for the mock.
