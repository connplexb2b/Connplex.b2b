const fs = require('fs');
const assert = require('assert');

// 1. Read the mock/live ticketing API data we fetched earlier
const dataPath = 'c:\\Users\\admin\\Downloads\\b2b-website-main\\b2b-website-main\\scratch\\all-movies.json';
if (!fs.existsSync(dataPath)) {
  console.error('Mock data file not found!');
  process.exit(1);
}

const recent = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const list = recent.recentReleasesMovies;

// 2. Format
const ahmedabadId = '64da17939cdcb529a693aac2';
const formatted = list.map((m) => {
  const category = m.category ? m.category.split(',').map((s) => s.trim()).filter(Boolean).join(' • ') : '';
  let displayName = m.name || '';
  displayName = displayName.replace(/\s*\((HINDI|ENGLISH|TELUGU|TAMIL|KANNADA|MALAYALAM|GUJARATI|BENGALI|MARATHI)\)\s*$/i, '');

  return {
    src: `https://d1b2pdd8bvo7rr.cloudfront.net/uploads/${m.poster}`,
    alt: displayName,
    title: displayName,
    genre: category || 'Drama',
    rating: m.rating ? String(m.rating) : '4.8',
    link: m._id ? `https://ticketing.theconnplex.com/movie-details?mId=${m._id}&rId=${ahmedabadId}` : 'https://ticketing.theconnplex.com/',
    _isShowAvailable: !!m.isShowAvailable,
    _openingDate: m.filmOpeningDate ? new Date(m.filmOpeningDate).getTime() : 0,
    _originalName: m.name || ''
  };
});

// 3. Sort by:
// 1) isShowAvailable (true first)
// 2) filmOpeningDate (descending / latest first)
const sorted = formatted.sort((a, b) => {
  if (a._isShowAvailable !== b._isShowAvailable) {
    return a._isShowAvailable ? -1 : 1;
  }
  return b._openingDate - a._openingDate;
});

// 4. Helper function to get clean base title for de-duplication
const getCleanBaseTitle = (name) => {
  let cleaned = name.toLowerCase();
  cleaned = cleaned.replace(/\s*\((hindi|english|telugu|tamil|kannada|malayalam|gujarati|bengali|marathi)\)\s*$/g, '');
  cleaned = cleaned.replace(/^\s*3d\s+/g, '');
  cleaned = cleaned.replace(/\s+3d\s*$/g, '');
  return cleaned.trim();
};

// 5. De-duplicate
const uniqueMovies = [];
const seenTitles = new Set();

for (const movie of sorted) {
  const baseTitle = getCleanBaseTitle(movie._originalName);
  if (!seenTitles.has(baseTitle)) {
    seenTitles.add(baseTitle);
    const { _isShowAvailable, _openingDate, _originalName, ...clientMovie } = movie;
    uniqueMovies.push(clientMovie);
  }
}

// 6. Verification
console.log('Resulting top 10 unique movies:');
uniqueMovies.slice(0, 10).forEach((m, idx) => {
  console.log(`${idx + 1}. ${m.title} (Rating: ${m.rating}, Genre: ${m.genre})`);
});

// Assert that the top 3 are exactly the latest active screenings:
assert.strictEqual(uniqueMovies[0].title, 'HAUNTED 3D: ECHOES OF THE PAST');
assert.strictEqual(uniqueMovies[1].title, 'GOVERNOR : THE SILENT SAVIOUR');
assert.strictEqual(uniqueMovies[2].title, 'HAI JAWANI TOH ISHQ HONA HAI');
assert.strictEqual(uniqueMovies[3].title, 'PEDDI');

console.log('\nSUCCESS: All sorting and de-duplication assertions passed!');
