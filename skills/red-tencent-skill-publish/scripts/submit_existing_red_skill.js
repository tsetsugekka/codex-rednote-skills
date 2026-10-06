#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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
    path.resolve(process.cwd(), 'node_modules/redskillhub-upload')
  ];
  const found = candidates.find((candidate) => fs.existsSync(path.join(candidate, 'cli/index.mjs')));
  if (found) {
    return found;
  }
  throw new Error('missing uploader root; pass --uploader-root /path/to/redskillhub-upload');
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

const args = parseArgs(process.argv.slice(2));
if (args.env !== 'prod') {
  throw new Error('existing RED Skill updates require --env prod');
}
if (args['api-base']) {
  throw new Error('--api-base is not supported; use the official production endpoint');
}
const uploaderRoot = resolveUploaderRoot(args);
const uploaderPackage = JSON.parse(fs.readFileSync(path.join(uploaderRoot, 'package.json'), 'utf8'));
if (uploaderPackage.name !== 'redskillhub-upload') {
  throw new Error('update the official CLI to redskillhub-upload before using this helper');
}
if (!/^\d+\.\d+\.\d+$/.test(uploaderPackage.version || '')) {
  throw new Error('use the official latest stable CLI for production updates');
}
const packagePath = path.resolve(requireArg(args, 'package'));
const skillId = requireArg(args, 'skill-id');
if (!/^\d+$/.test(skillId)) {
  throw new Error('--skill-id must be the existing numeric RED Skill ID');
}
const identifier = requireArg(args, 'identifier');
const name = requireArg(args, 'name');
const version = requireArg(args, 'version');
const source = requireArg(args, 'source');
const tag = args.tag || args['tag-id'];

if (!tag) {
  throw new Error('missing required argument: --tag or --tag-id');
}

const { prepareBundle } = await importUploader(uploaderRoot, 'cli/pack.mjs');
const { uploadBundle } = await importUploader(uploaderRoot, 'cli/upload.mjs');
const { buildDraftPayload, submitSkillVersion } = await importUploader(uploaderRoot, 'cli/submit.mjs');
const { readCredentials, login } = await importUploader(uploaderRoot, 'cli/auth.mjs');
const { ensurePublishCredentials } = await importUploader(uploaderRoot, 'cli/index.mjs');
const { loadContentTags } = await importUploader(uploaderRoot, 'cli/tags.mjs');
const { resolveApiBase, DEFAULT_API_BASE } = await importUploader(uploaderRoot, 'cli/config.mjs');

const flags = {
  env: 'prod',
  source,
  name,
  identifier,
  version,
  tag
};
if (args['repost-source']) {
  flags.repostSource = args['repost-source'];
}
if (resolveApiBase(flags, process.env) !== DEFAULT_API_BASE) {
  throw new Error('production updates cannot override the official API base');
}

const tagOptions = await loadContentTags({ flags, env: process.env });
const bundle = await prepareBundle(packagePath, { env: process.env, flags });
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

const credentials = await ensurePublishCredentials({ flags, env: process.env, readCredentials, login });

const upload = await uploadBundle(bundle, {
  accessToken: credentials.accessToken,
  flags,
  env: process.env,
  progressStream: process.stderr
});
const payload = {
  ...payloadBase,
  bundle_file_id: upload.bundleFileId,
  bundle_sha256: upload.bundleSha256,
  bundle_size_bytes: upload.bundleSizeBytes
};

const body = await submitSkillVersion(payload, { flags, env: process.env, accessToken: credentials.accessToken });

console.log(JSON.stringify({
  status: 'submitted',
  response: compactBody(body)
}, null, 2));
