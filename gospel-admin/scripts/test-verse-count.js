const parseVerseRange = (reference) => {
  const CHAPTER_VERSE_COUNTS = {
    'Deuteronomy': [34, 25, 17, 44, 49, 16, 30, 20, 48, 21, 13, 21, 13, 27, 19, 19, 20, 28, 10, 27, 36, 30, 22, 29, 23, 22, 20, 22, 21, 28, 29, 30, 30, 34, 22, 26, 22],
    'Psalms': [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 13, 15, 10, 17, 16, 16, 13, 3, 0, 14, 17, 14, 16, 5, 5, 10, 7, 6, 8, 5, 12, 15, 13, 12, 9, 9, 5, 6, 7, 5, 7, 8, 5, 8, 6, 14, 5, 6, 10, 8, 7, 1, 14, 10, 4, 14, 7, 6, 4, 6, 8, 9, 4, 8, 7, 10, 6, 10, 4, 14, 7, 10, 7, 1, 4, 7, 8, 4, 5, 7, 10, 4, 7, 7, 5, 5, 5, 8, 5, 14, 5, 6, 5, 7, 13, 5, 5, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 5, 6, 7, 8, 8, 7, 7, 10, 5, 10, 10, 9, 13, 5, 11, 10, 6, 9, 9, 8, 8, 3, 9, 4, 8, 8, 8, 9, 4, 8, 6, 7, 12, 5, 11, 7, 7, 8, 7, 10, 1, 10, 10, 4, 8, 8, 4, 12, 10, 9, 13, 8, 15, 3, 7, 8, 8, 8, 8, 8, 8, 13, 4, 8, 5, 8, 11, 11, 8, 5, 5, 5, 8, 9, 8, 5, 5, 10, 8, 9, 4, 7, 6, 7, 10, 8, 1, 6, 6, 4, 6, 9, 5, 4, 7, 8, 8, 6, 10, 1, 10, 4, 14, 3, 19, 7, 8, 9, 3, 7, 8, 9, 3, 2, 9, 13, 4, 3, 6, 3, 4, 7, 6, 13, 4, 4, 7, 6, 11, 18, 7, 22, 18, 12, 12, 13, 11, 9, 14, 15, 8],
    'Psalm': [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 13, 15, 10, 17, 16, 16, 13, 3, 18, 14, 17, 14, 16, 5, 5, 10, 7, 6, 8, 5, 12, 15, 13, 12, 9, 9, 5, 6, 7, 5, 7, 8, 5, 8, 6, 14, 5, 6, 10, 8, 7, 1, 14, 10, 4, 14, 7, 6, 4, 6, 8, 9, 4, 8, 7, 10, 6, 10, 4, 14, 7, 10, 7, 1, 4, 7, 8, 4, 5, 7, 10, 4, 7, 7, 5, 5, 5, 8, 5, 14, 5, 6, 5, 7, 13, 5, 5, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 5, 6, 7, 8, 8, 7, 7, 10, 5, 10, 10, 9, 13, 5, 11, 10, 6, 9, 9, 8, 8, 3, 9, 4, 8, 8, 8, 9, 4, 8, 6, 7, 12, 5, 11, 7, 7, 8, 7, 10, 1, 10, 10, 4, 8, 8, 4, 12, 10, 9, 13, 8, 15, 3, 7, 8, 8, 8, 8, 8, 8, 13, 4, 8, 5, 8, 11, 11, 8, 5, 5, 5, 8, 9, 8, 5, 5, 10, 8, 9, 4, 7, 6, 7, 10, 8, 1, 6, 6, 4, 6, 9, 5, 4, 7, 8, 8, 6, 10, 1, 10, 4, 14, 3, 19, 7, 8, 9, 3, 7, 8, 9, 3, 2, 9, 13, 4, 3, 6, 3, 4, 7, 6, 13, 4, 4, 7, 6, 11, 18, 7, 22, 18, 12, 12, 13, 11, 9, 14, 15, 8],
    'Isaiah': [31, 22, 26, 6, 30, 13, 25, 23, 20, 19, 19, 25, 22, 16, 19, 15, 16, 15, 13, 27, 14, 17, 20, 13, 13, 13, 14, 20, 31, 26, 20, 26, 13, 19, 30, 26, 27, 26, 24, 23, 26, 23, 23, 28, 25, 31, 29, 30, 23, 25, 28, 23, 19, 13, 19, 27, 31, 30, 21, 22, 25, 28, 23, 23, 24, 26, 20, 26, 31, 34],
    'Ephesians': [23, 22, 21, 32, 33, 24],
    'John': [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25],
    'Colossians': [29, 23, 25, 18],
    'Ecclesiastes': [18, 26, 22, 16, 20, 12, 29, 17],
    'Galatians': [24, 21, 29, 31, 26, 18],
    'Ezekiel': [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35],
    'Genesis': [31, 25, 24, 26, 32, 22, 29, 32, 32, 20, 29, 23, 22, 20, 25, 22, 27, 32, 20, 26, 21, 26, 34, 22, 22, 29, 2, 32, 27, 24],
    'I Corinthians': [25, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
  };
  
  const bookMatch = reference.match(/^([A-Za-z\s]+?)\s+(\d+)(?::(\d+))?(?:–(\d+))?(?::(\d+))?(?:–(\d+))?$/);
  if (!bookMatch) {
    return 1;
  }
  
  const book = bookMatch[1].trim();
  const startChapter = parseInt(bookMatch[2]);
  const startVerse = bookMatch[3] ? parseInt(bookMatch[3]) : null;
  const endVerseInChapter = bookMatch[4] ? parseInt(bookMatch[4]) : null;
  
  let chapterCounts = null;
  for (const key in CHAPTER_VERSE_COUNTS) {
    if (key.toLowerCase() === book.toLowerCase()) {
      chapterCounts = CHAPTER_VERSE_COUNTS[key];
      break;
    }
  }
  
  // Whole chapter reference
  if (startVerse === null && endVerseInChapter === null) {
    if (chapterCounts && startChapter <= chapterCounts.length) {
      return chapterCounts[startChapter - 1];
    }
    return 1;
  }
  
  // Verse range in same chapter
  if (startVerse !== null && endVerseInChapter) {
    return endVerseInChapter - startVerse + 1;
  }
  
  // Single verse
  if (startVerse !== null) {
    return 1;
  }
  
  return 1;
};

const refs = [
  'Deuteronomy 4:35', 'Deuteronomy 4', 'Psalms 86:8', 'Isaiah 40:25–26', 'Isaiah 46', 
  'Ephesians 2:1–3', 'Galatians 3:22–24', 'Colossians 1:16–17', 'John 17', 'Ecclesiastes 7:20',
  'Genesis 1:26', 'Genesis 3:1–7', 'Ezekiel 14:6', 'Psalm 139:23', 'Psalm 38:18', 'Psalm 38'
];

let total = 0;
console.log('Verse count breakdown:');
refs.forEach(r => {
  const count = parseVerseRange(r);
  console.log(`  ${r.padEnd(30)} = ${count} verses`);
  total += count;
});
console.log(`\nTotal verses cached: ${total}`);
console.log(`ESV API limit: 500 verses`);
console.log(`Status: ${total <= 500 ? '✓ COMPLIANT' : '⚠ EXCEEDS LIMIT'}`);
