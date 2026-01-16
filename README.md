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


### Note:

The run fails for rvt synced iModels but passes for dgn synced iModels.

The failure stacktrace looks like this:
```shell
anmol.shrestha@KK244CWRWJ transformer-issue-repro % pnpm start             

> transformer-issue-repro@1.0.0 start /Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro
> node lib/index.js

[dotenv@17.2.3] injecting env (4) from .env -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
✓ IModelHost initialized
Initializing OAuth authentication...
A browser window will open for you to sign in.
✓ Successfully authenticated
Downloading source iModel...
✓ Source iModel opened: /Users/anmol.shrestha/Library/Caches/iModelJs/imodels/e635341b-767f-45dc-946b-048ffb091fab/briefcases/16.bim
Creating target iModel...
✓ Target iModel created: /Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/output/transformed-1768578808118.bim
Applying transformations...
Error during transformation: AssertionError [ERR_ASSERTION]: An unknown root class 'SpatialComposition.Zone' was encountered while populating
the nav prop reference type cache for BuildingSpatial.Zone.
This is a bug.
    at ECReferenceTypesCache.relInfoFromRelClass (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/ECReferenceTypesCache.js:238:9)
    at async /Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/ECReferenceTypesCache.js:161:29
    at async Promise.all (index 3)
    at async ECReferenceTypesCache.initSchema (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/ECReferenceTypesCache.js:169:9)
    at async ECReferenceTypesCache.initAllSchemasInIModel (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/ECReferenceTypesCache.js:119:17)
    at async IModelCloneContext.initialize (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/IModelCloneContext.js:27:9)
    at async CustomTransformer.initialize (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/IModelTransformer.js:1906:9)
    at async CustomTransformer.processModel (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/IModelTransformer.js:1390:9)
    at async TransformerApp.applyTransformations (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/lib/index.js:115:13)
    at async TransformerApp.run (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/lib/index.js:159:13) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '=='
}
✓ Source iModel closed
✓ Target iModel closed
✓ IModelHost shutdown
Fatal error: AssertionError [ERR_ASSERTION]: An unknown root class 'SpatialComposition.Zone' was encountered while populating
the nav prop reference type cache for BuildingSpatial.Zone.
This is a bug.
    at ECReferenceTypesCache.relInfoFromRelClass (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/ECReferenceTypesCache.js:238:9)
    at async /Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/ECReferenceTypesCache.js:161:29
    at async Promise.all (index 3)
    at async ECReferenceTypesCache.initSchema (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/ECReferenceTypesCache.js:169:9)
    at async ECReferenceTypesCache.initAllSchemasInIModel (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/ECReferenceTypesCache.js:119:17)
    at async IModelCloneContext.initialize (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/IModelCloneContext.js:27:9)
    at async CustomTransformer.initialize (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/IModelTransformer.js:1906:9)
    at async CustomTransformer.processModel (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/node_modules/.pnpm/@itwin+imodel-transformer@2.0.0-dev.5_@itwin+core-backend@5.5.1_@itwin+core-bentley@5.5_8185105d8947911ab8841521b7c3478b/node_modules/@itwin/imodel-transformer/lib/cjs/IModelTransformer.js:1390:9)
    at async TransformerApp.applyTransformations (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/lib/index.js:115:13)
    at async TransformerApp.run (/Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/lib/index.js:159:13) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '=='
}
 ELIFECYCLE  Command failed with exit code 1.
```

Whereas a passing run looks like this:
```shell
anmol.shrestha@KK244CWRWJ transformer-issue-repro % pnpm start

> transformer-issue-repro@1.0.0 start /Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro
> node lib/index.js

[dotenv@17.2.3] injecting env (4) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
✓ IModelHost initialized
Initializing OAuth authentication...
A browser window will open for you to sign in.
✓ Successfully authenticated
Downloading source iModel...
✓ Source iModel opened: /Users/anmol.shrestha/Library/Caches/iModelJs/imodels/39cc0bdb-69c4-4bc4-9132-d0cd727f2cc9/briefcases/8.bim
Creating target iModel...
✓ Target iModel created: /Users/anmol.shrestha/Documents/Bentley/transformer-issue-repro/output/transformed-1768578842584.bim
Applying transformations...
✓ Transformations applied successfully
Processing transformed iModel...
✓ Processed iModel contains 635 elements

✓ Transformation completed successfully!
✓ Source iModel closed
✓ Target iModel closed
✓ IModelHost shutdown
```