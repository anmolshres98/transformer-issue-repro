# Transformer Issue Repro

A pnpm project for iModel transformer application that downloads iModels from the cloud, applies transformations, and processes them.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your iTwin Platform credentials:
- `IMJS_CLIENT_ID`: native iTwin application client ID
- `ITWIN_ID`: The iTwin project ID
- `IMODEL_ID`: The source iModel ID

## Build

```bash
pnpm build
```

## Run

```bash
pnpm start
```
