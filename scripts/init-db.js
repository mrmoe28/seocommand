const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Create the database file
const dbPath = path.join(__dirname, '..', 'dev.db');
const db = new Database(dbPath);

// Read and execute the migration SQL
const migrationPath = path.join(__dirname, '..', 'drizzle', '0000_next_cobalt_man.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

// Split by statements and execute each one
const statements = migrationSQL.split(';').filter(stmt => stmt.trim());

for (const statement of statements) {
  if (statement.trim()) {
    try {
      db.exec(statement);
      console.log('✓ Executed:', statement.substring(0, 50) + '...');
    } catch (error) {
      console.error('Error executing statement:', error.message);
      console.error('Statement:', statement);
    }
  }
}

console.log('\n✅ Database initialized successfully!');
console.log('📁 Database file created at:', dbPath);

db.close();