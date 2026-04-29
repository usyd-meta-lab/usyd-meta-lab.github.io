import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORCID_ID = '0000-0001-8120-1573';

async function fetchSummary() {
  const res = await fetch(`https://pub.orcid.org/v3.0/${ORCID_ID}/works`, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) throw new Error(`ORCID summary failed: ${res.status}`);
  return (await res.json()).group.map(g => g['work-summary'][0]);
}

async function fetchFullRecord(code) {
  const res = await fetch(`https://pub.orcid.org/v3.0/${ORCID_ID}/work/${code}`, {
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) throw new Error(`ORCID work ${code} failed: ${res.status}`);
  return res.json();
}

async function fetchCrossrefAuthors(doi) {
  try {
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
    if (!res.ok) return null;
    const authors = (await res.json()).message.author || [];
    return authors.map(a => {
      const last = a.family || a.literal || 'Unknown';
      const initials = (a.given || '').split(/\s+/).map(n => n[0]?.toUpperCase() + '.').join(' ');
      return `${last}, ${initials}`;
    });
  } catch { return null; }
}

function formatList(names) {
  if (!names.length) return 'Unknown';
  if (names.length > 7) return `${names[0]} et al.`;
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return names.slice(0, -1).join(', ') + ', & ' + names[names.length - 1];
}

function parseOrcidContributors(contrib = []) {
  return contrib.map(c => {
    const st = c['contributor-name'];
    const fb = c['credit-name']?.value;
    if (st?.['family-name'] && st?.['given-names']) {
      const last = st['family-name'].value;
      const init = st['given-names'].value.split(/\s+/).map(n => n[0].toUpperCase() + '.').join(' ');
      return `${last}, ${init}`;
    }
    if (fb) {
      if (fb.includes(',')) {
        const [last, rest] = fb.split(',');
        const init = rest.trim().split(/\s+/).map(n => n[0].toUpperCase() + '.').join(' ');
        return `${last.trim()}, ${init}`;
      }
      const p = fb.trim().split(/\s+/);
      if (p.length >= 2) {
        const last = p.pop();
        const init = p.map(n => n[0].toUpperCase() + '.').join(' ');
        return `${last}, ${init}`;
      }
      return fb;
    }
    return null;
  }).filter(Boolean);
}

const cleanTitle = t => t?.replace(/: [A-Z][A-Za-z0-9 ,&–-]{2,60}$/, '') || 'Untitled';

async function main() {
  console.log('Fetching ORCID publications...');
  const summaries = await fetchSummary();
  console.log(`Found ${summaries.length} works`);

  const detailed = await Promise.all(summaries.map(s => fetchFullRecord(s['put-code'])));

  const records = [];
  for (const pub of detailed) {
    if (!(pub.type?.toLowerCase() === 'journal-article' || pub.type === 'JOURNAL_ARTICLE')) continue;

    const title  = cleanTitle(pub.title?.title?.value);
    const year   = pub['publication-date']?.year?.value || 'No Year';
    const doiObj = (pub['external-ids']?.['external-id'] || []).find(id => id['external-id-type'] === 'doi');
    const doi    = doiObj ? doiObj['external-id-value'] : null;
    const journal = pub['journal-title']?.value || '';

    let authors = parseOrcidContributors(pub.contributors?.contributor || []);
    if (authors.length <= 1 && doi) {
      const cross = await fetchCrossrefAuthors(doi);
      if (cross?.length) authors = cross;
    }

    records.push({ title, year, authors: formatList(authors), doi, journal });
  }

  console.log(`Processed ${records.length} journal articles`);

  const snapshot = { fetched: new Date().toISOString(), records };
  const json = JSON.stringify(snapshot, null, 2);
  const root = join(__dirname, '..');

  writeFileSync(join(root, 'files/publications-orcid-snapshot.json'), json, 'utf-8');
  writeFileSync(
    join(root, 'files/publications-orcid-snapshot.js'),
    `window.__ORCID_SNAPSHOT__ = ${json};\n`,
    'utf-8'
  );

  console.log(`Saved snapshot with ${records.length} records (fetched: ${snapshot.fetched})`);
}

main().catch(err => { console.error(err); process.exit(1); });
