const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mchtyihbwlzjhkcmdvib.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jaHR5aWhid2x6amhrY21kdmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjQ1MTMsImV4cCI6MjA3NzQ0MDUxM30.DaPs61676KfcOZ40j3OH2UfQ6e1tjrWi9x4XnJ3K7vE'
);

async function countESVCache() {
  console.log('Counting ESV verses in scripture cache...\n');
  
  // Get all cache entries for ESV
  const { data: cacheData, error: cacheError } = await supabase
    .from('scripture_cache')
    .select('reference')
    .eq('translation', 'esv');
  
  if (cacheError) {
    console.error('Error querying cache:', cacheError);
    return;
  }
  
  if (!cacheData || cacheData.length === 0) {
    console.log('No cached ESV verses found.');
    return;
  }
  
  // Count unique references
  const uniqueRefs = new Set();
  cacheData.forEach(entry => {
    if (entry.reference) {
      uniqueRefs.add(entry.reference);
    }
  });
  
  console.log('ESV Scripture Cache Statistics:');
  console.log('================================');
  console.log(`Total cache entries: ${cacheData.length}`);
  console.log(`Unique verses/references: ${uniqueRefs.size}`);
  console.log(`\nUnique references (sorted):`);
  
  const sortedRefs = Array.from(uniqueRefs).sort();
  sortedRefs.forEach(ref => {
    console.log(`  - ${ref}`);
  });
}

countESVCache().catch(console.error);
