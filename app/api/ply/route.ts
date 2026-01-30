import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

const DEFAULT_ROOTS = ['/tmp'];
const allowedRoots = (process.env.GS_PLY_ROOTS ?? '')
  .split(',')
  .map((root) => root.trim())
  .filter(Boolean);

const roots = allowedRoots.length > 0 ? allowedRoots : DEFAULT_ROOTS;

function isPathAllowed(filePath: string) {
  if (!path.isAbsolute(filePath)) {
    return false;
  }
  const resolved = path.resolve(filePath);
  return roots.some((root) => {
    const resolvedRoot = path.resolve(root);
    return resolved === resolvedRoot || resolved.startsWith(resolvedRoot + path.sep);
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPath = searchParams.get('path');

  if (!rawPath) {
    return Response.json({ error: 'Missing path query param.' }, { status: 400 });
  }

  if (rawPath.includes('\0')) {
    return Response.json({ error: 'Invalid path.' }, { status: 400 });
  }

  const resolvedPath = path.resolve(rawPath);

  if (!isPathAllowed(resolvedPath)) {
    return Response.json({ error: 'Path not allowed.' }, { status: 403 });
  }

  if (!resolvedPath.toLowerCase().endsWith('.ply')) {
    return Response.json({ error: 'Only .ply files are supported.' }, { status: 400 });
  }

  let fileStat;
  try {
    fileStat = await stat(resolvedPath);
  } catch {
    return Response.json({ error: 'File not found.' }, { status: 404 });
  }

  if (!fileStat.isFile()) {
    return Response.json({ error: 'Path is not a file.' }, { status: 400 });
  }

  const stream = createReadStream(resolvedPath);

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileStat.size.toString(),
      'Cache-Control': 'no-store',
    },
  });
}
