#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

class DatabaseBackup {
  constructor() {
    this.backupDir = path.join(__dirname, '../backups');
    this.maxBackups = 30; // Keep 30 days of backups
    
    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `aimee-backup-${timestamp}.sql`;
    const filepath = path.join(this.backupDir, filename);
    
    console.log(`🔄 Starting database backup: ${filename}`);
    
    try {
      // Validate environment variables
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing Supabase credentials');
      }

      // Test database connection first
      await this.testConnection();

      // Create backup using pg_dump
      const dbUrl = this.getDatabaseUrl();
      const command = `pg_dump "${dbUrl}" > "${filepath}"`;
      
      await this.executeCommand(command);
      
      // Verify backup file was created and has content
      if (fs.existsSync(filepath) && fs.statSync(filepath).size > 0) {
        console.log(`✅ Backup created successfully: ${filename}`);
        console.log(`📁 Location: ${filepath}`);
        console.log(`📊 Size: ${this.formatBytes(fs.statSync(filepath).size)}`);
        
        // Cleanup old backups
        await this.cleanupOldBackups();
        
        return filepath;
      } else {
        throw new Error('Backup file was not created or is empty');
      }
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      
      // Clean up failed backup file
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      
      throw error;
    }
  }

  async testConnection() {
    console.log('🔍 Testing database connection...');
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error && !error.message.includes('relation "users" does not exist')) {
      throw new Error(`Database connection failed: ${error.message}`);
    }

    console.log('✅ Database connection successful');
  }

  getDatabaseUrl() {
    // Extract database URL from Supabase URL
    const supabaseUrl = process.env.SUPABASE_URL;
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    
    if (!projectRef) {
      throw new Error('Could not extract project reference from Supabase URL');
    }

    // Construct PostgreSQL connection URL
    // Note: You'll need to get the actual database password from Supabase settings
    const dbPassword = process.env.SUPABASE_DB_PASSWORD;
    if (!dbPassword) {
      throw new Error('SUPABASE_DB_PASSWORD environment variable is required for backups');
    }

    return `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      console.log('🔄 Executing backup command...');
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Command failed: ${error.message}`));
          return;
        }
        
        if (stderr && !stderr.includes('NOTICE')) {
          console.warn('⚠️ Command stderr:', stderr);
        }
        
        resolve(stdout);
      });
    });
  }

  async cleanupOldBackups() {
    console.log('🧹 Cleaning up old backups...');
    
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.startsWith('aimee-backup-') && file.endsWith('.sql'))
        .map(file => ({
          name: file,
          path: path.join(this.backupDir, file),
          mtime: fs.statSync(path.join(this.backupDir, file)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime); // Sort by modification time, newest first

      if (files.length > this.maxBackups) {
        const filesToDelete = files.slice(this.maxBackups);
        
        for (const file of filesToDelete) {
          fs.unlinkSync(file.path);
          console.log(`🗑️ Deleted old backup: ${file.name}`);
        }
        
        console.log(`✅ Cleaned up ${filesToDelete.length} old backup(s)`);
      } else {
        console.log(`✅ No cleanup needed (${files.length}/${this.maxBackups} backups)`);
      }
      
    } catch (error) {
      console.error('⚠️ Cleanup failed:', error.message);
      // Don't throw - backup was successful even if cleanup failed
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async listBackups() {
    const files = fs.readdirSync(this.backupDir)
      .filter(file => file.startsWith('aimee-backup-') && file.endsWith('.sql'))
      .map(file => {
        const filepath = path.join(this.backupDir, file);
        const stats = fs.statSync(filepath);
        return {
          name: file,
          size: this.formatBytes(stats.size),
          created: stats.mtime.toISOString(),
          path: filepath
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    return files;
  }
}

// CLI interface
async function main() {
  const backup = new DatabaseBackup();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      try {
        await backup.createBackup();
        process.exit(0);
      } catch (error) {
        console.error('Backup failed:', error.message);
        process.exit(1);
      }
      break;
      
    case 'list':
      try {
        const backups = await backup.listBackups();
        console.log('\n📋 Available backups:');
        if (backups.length === 0) {
          console.log('No backups found');
        } else {
          backups.forEach(backup => {
            console.log(`📁 ${backup.name}`);
            console.log(`   Size: ${backup.size}`);
            console.log(`   Created: ${backup.created}`);
            console.log('');
          });
        }
      } catch (error) {
        console.error('Failed to list backups:', error.message);
        process.exit(1);
      }
      break;
      
    default:
      console.log('Usage:');
      console.log('  node backup-database.js create  - Create a new backup');
      console.log('  node backup-database.js list    - List all backups');
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { DatabaseBackup }; 