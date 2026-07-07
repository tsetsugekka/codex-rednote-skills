#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--dry-run') {
      args.dryRun = true;
    } else if (item.startsWith('--')) {
      const key = item.slice(2);
      args[key] = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function requireArg(args, name) {
  const value = args[name];
  if (!value) {
    throw new Error(`missing required argument: --${name}`);
  }
  return value;
}

function resolveUploaderRoot(args) {
  const explicit = args['uploader-root'] || process.env.SKILLHUB_UPLOAD_ROOT;
  if (explicit) {
    return path.resolve(explicit);
  }
  const candidates = [
    path.resolve(process.cwd(), 'skillhub-upload-prefix/lib/node_modules/@xhs/skillhub-upload'),
    path.resolve(process.cwd(), 'node_modules/@xhs/skillhub-upload')
  ];
  const found = candidates.find((candidate) => fs.existsSync(path.join(candidate, 'cli/index.mjs')));
  if (found) {
    return found;
  }
  throw new Error('missing uploader root; pass --uploader-root /path/to/@xhs/skillhub-upload');
}

async function importUploader(root, relPath) {
  return import(pathToFileURL(path.join(root, relPath)).href);
}

function unwrapResponseBody(body) {
  return body?.data && typeof body.data === 'object' ? body.data : body;
}

function compactBody(body) {
  const data = unwrapResponseBody(body);
  return {
    code: body?.code ?? data?.code ?? data?.result?.code ?? null,
    success: body?.success ?? data?.success ?? data?.result?.success ?? null,
    message: data?.message ?? data?.msg ?? data?.result?.message ?? data?.result?.errorMessage ?? body?.message ?? body?.msg ?? null,
    skill_id: data?.skill_id ?? data?.skillId ?? data?.result?.skill_id ?? data?.result?.skillId ?? null,
    version_id: data?.version_id ?? data?.versionId ?? data?.result?.version_id ?? data?.result?.versionId ?? null,
    audit_request_id: data?.audit_request_id ?? data?.auditRequestId ?? data?.result?.audit_request_id ?? data?.result?.auditRequestId ?? null,
    display_status: data?.display_status ?? data?.displayStatus ?? data?.result?.display_status ?? data?.result?.displayStatus ?? null
  };
}

function isRejected(httpOk, body) {
  const compact = compactBody(body);
  if (!httpOk) {
    return true;
  }
  if (compact.success === false) {
    return true;
  }
  return compact.code !== null
    && compact.code !== undefined
    && compact.code !== 0
    && compact.code !== '0'
    && compact.code !== 'OK';
}

const args = parseArgs(process.argv.slice(2));
const uploaderRoot = resolveUploaderRoot(args);
const packagePath = path.resolve(requireArg(args, 'package'));
const skillId = requireArg(args, 'skill-id');
const identifier = requireArg(args, 'identifier');
const name = requireArg(args, 'name');
const version = args.version || '1.0.1';
const source = args.source || 'original';
const tag = args.tag || args['tag-id'];
const apiBaseOverride = args['api-base'];

if (!tag) {
  throw new Error('missing required argument: --tag or --tag-id');
}

const { prepareBundle } = await importUploader(uploaderRoot, 'cli/pack.mjs');
const { uploadBundle } = await importUploader(uploaderRoot, 'cli/upload.mjs');
const { buildDraftPayload } = await importUploader(uploaderRoot, 'cli/submit.mjs');
const { readCredentials } = await importUploader(uploaderRoot, 'cli/auth.mjs');
const { DEFAULT_API_BASE } = await importUploader(uploaderRoot, 'cli/config.mjs');
const { loadContentTags } = await importUploader(uploaderRoot, 'cli/tags.mjs');

const flags = {
  source,
  name,
  identifier,
  version,
  tag
};
if (args['repost-source']) {
  flags.repostSource = args['repost-source'];
}
if (apiBaseOverride) {
  flags.apiBase = apiBaseOverride;
}

const tagOptions = await loadContentTags({ flags, env: process.env });
const bundle = await prepareBundle(packagePath, { env: process.env });
const bundleMetadata = {
  bundleSha256: bundle.bundleSha256,
  bundleSizeBytes: bundle.bundleSizeBytes
};
const draftPayload = buildDraftPayload({
  flags,
  metadata: bundle.metadata,
  bundle: bundleMetadata,
  tagOptions
});

const payloadBase = {
  ...draftPayload,
  skill_id: skillId
};

if (args.dryRun) {
  console.log(JSON.stringify({
    status: 'dry_run',
    payload: {
      ...payloadBase,
      bundle_file_id: 'dry-run-bundle-file-id'
    }
  }, null, 2));
  process.exit(0);
}

const credentials = await readCredentials(process.env);
if (!credentials?.accessToken) {
  throw new Error('missing RED Skill credentials; run skillhub-upload login first');
}

const upload = await uploadBundle(bundle, {
  accessToken: credentials.accessToken,
  flags,
  progressStream: process.stderr
});
const payload = {
  ...payloadBase,
  bundle_file_id: upload.bundleFileId,
  bundle_sha256: upload.bundleSha256,
  bundle_size_bytes: upload.bundleSizeBytes
};

const apiBase = apiBaseOverride || DEFAULT_API_BASE;
const endpoint = '/api/sns/v1/creator/red_skill/cli_submit_skill_version';
const response = await fetch(`${apiBase}${endpoint}`, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${credentials.accessToken}`,
    'content-type': 'application/json'
  },
  body: JSON.stringify(payload)
});
const body = await response.json().catch(() => ({}));
const compact = compactBody(body);

if (isRejected(response.ok, body)) {
  console.log(JSON.stringify({
    status: 'error',
    code: 'SUBMIT_REJECTED',
    http: response.status,
    response: compact
  }, null, 2));
  process.exit(22);
}

console.log(JSON.stringify({
  status: 'submitted',
  response: compact
}, null, 2));
