#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'backups');
  
  // Ensure backup directory exists
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const tables = ['users', 'messages', 'memories', 'subscription_plans', 'usage_tracking'];
  const backup = {
    timestamp,
    version: '1.0',
    data: {}
  };

  try {
    console.log('Starting database backup...');
    
    for (const table of tables) {
      console.log(`Backing up ${table}...`);
      const { data, error } = await supabase
        .from(table)
        .select('*');
      
      if (error) {
        console.error(`Error backing up ${table}:`, error);
        continue;
      }
      
      backup.data[table] = data;
      console.log(`✓ Backed up ${data?.length || 0} records from ${table}`);
    }

    const filename = `backup-${timestamp}.json`;
    const filepath = path.join(backupDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
    console.log(`✓ Backup saved to ${filepath}`);
    
    // Clean up old backups (keep last 30)
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length > 30) {
      const filesToDelete = files.slice(30);
      filesToDelete.forEach(file => {
        fs.unlinkSync(path.join(backupDir, file));
        console.log(`Deleted old backup: ${file}`);
      });
    }
    
  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  backupDatabase();
}

module.exports = { backupDatabase }; 