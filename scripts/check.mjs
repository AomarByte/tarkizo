// Quick checks run by CI on every push: the page script parses, all four languages
// have the same texts, and every file the page or the service worker needs exists.
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const errors = [];
const fail = msg => errors.push(msg);
const html = readFileSync('index.html', 'utf8');

// 1. The inline script must parse
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length !== 1) fail(`expected 1 inline script, found ${scripts.length}`);
const js = scripts[0] || '';
try { new vm.Script(js, { filename: 'index.html <script>' }); } catch (e) { fail('script does not parse: ' + e.message); }

// 2. Every language has exactly the same keys as Arabic
const m = js.match(/const T = (\{[\s\S]*?\n\}\});/);
if (!m) fail('translation table not found');
else {
  const T = vm.runInNewContext('(' + m[1].replace(/\}\);$/, '})') + ')');
  const base = Object.keys(T.ar);
  for (const lang of ['ku', 'en', 'de']) {
    const keys = Object.keys(T[lang] || {});
    const missing = base.filter(k => !keys.includes(k)), extra = keys.filter(k => !base.includes(k));
    if (missing.length) fail(`${lang}: missing ${missing.join(', ')}`);
    if (extra.length) fail(`${lang}: extra ${extra.join(', ')}`);
  }
  // every data-t="key" in the markup exists
  for (const [, k] of html.matchAll(/data-t="([^"]+)"/g)) if (!(k in T.ar)) fail(`data-t="${k}" has no text`);
}

// 3. Sound files referenced by the page exist
const files = js.match(/const FILES = \{([\s\S]*?)\};/);
if (!files) fail('FILES table not found');
else for (const [, f] of files[1].matchAll(/'([^']+\.mp3)'/g)) if (!existsSync('sounds/' + f)) fail('missing sounds/' + f);

// 4. Manifest icons and service-worker shell files exist
const manifest = JSON.parse(readFileSync('manifest.webmanifest', 'utf8'));
for (const icon of manifest.icons) if (!existsSync(icon.src)) fail('missing ' + icon.src);
const sw = readFileSync('sw.js', 'utf8');
try { new vm.Script(sw, { filename: 'sw.js' }); } catch (e) { fail('sw.js does not parse: ' + e.message); }
const shell = sw.match(/const SHELL = \[([^\]]*)\]/);
if (shell) for (const [, f] of shell[1].matchAll(/'\.\/([^']+)'/g)) if (!existsSync(f)) fail('service worker needs missing ' + f);
for (const ref of ['manifest.webmanifest', 'icons/favicon.svg', 'icons/apple-touch-icon.png', 'icons/favicon-32.png'])
  if (!html.includes(ref) || !existsSync(ref)) fail('page head reference broken: ' + ref);

if (errors.length) { console.error('✗ ' + errors.length + ' problem(s):\n  ' + errors.join('\n  ')); process.exit(1); }
console.log('✓ all checks passed');
