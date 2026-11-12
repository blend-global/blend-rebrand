# Environment and secrets

- Keep secrets in `.env.local`, which must remain ignored by Git.
- Never create `.env.example`, `env.example`, or other environment template files.
- Read configuration through environment variables; never put secret values in source, documentation, logs, or tool output.
