import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

async function testPrismaConnection() {
  logSection('Testing Prisma Connection (PostgreSQL)');
  
  try {
    log('Checking environment variables...', 'blue');
    const dbUrl = process.env.DATABASE_URL;
    const directUrl = process.env.DIRECT_URL;
    
    if (!dbUrl) {
      log('❌ DATABASE_URL is not set', 'red');
      return false;
    }
    if (!directUrl) {
      log('❌ DIRECT_URL is not set', 'red');
      return false;
    }
    
    log('✓ DATABASE_URL is set', 'green');
    log('✓ DIRECT_URL is set', 'green');
    
    log('\nAttempting to connect to database...', 'blue');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    if (result) {
      log('✓ Prisma connection successful!', 'green');
      
      log('\nTesting database schema...', 'blue');
      const tableCount = await prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*)::int as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'posts'
      `;
      
      if (tableCount[0]?.count && Number(tableCount[0].count) > 0) {
        log('✓ Posts table exists', 'green');
        
        const postCount = await prisma.post.count();
        log(`✓ Found ${postCount} post(s) in database`, 'green');
      } else {
        log('⚠ Posts table not found - migrations may not be applied', 'yellow');
      }
      
      return true;
    }
    
    return false;
  } catch (error: any) {
    log('❌ Prisma connection failed', 'red');
    log(`Error: ${error.message}`, 'red');
    
    if (error.message?.includes("Can't reach database server")) {
      log('\n💡 Tip: Your Supabase project may be paused.', 'yellow');
      log('   Please check the Supabase dashboard and restore the project if needed.', 'yellow');
    }
    
    return false;
  }
}

async function testSupabaseConnection() {
  logSection('Testing Supabase Client Connection');
  
  try {
    log('Checking environment variables...', 'blue');
    
    if (!SUPABASE_URL) {
      log('❌ NEXT_PUBLIC_SUPABASE_URL is not set', 'red');
      return false;
    }
    if (!SUPABASE_ANON_KEY) {
      log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set', 'red');
      return false;
    }
    
    log('✓ NEXT_PUBLIC_SUPABASE_URL is set', 'green');
    log(`  URL: ${SUPABASE_URL}`, 'blue');
    log('✓ NEXT_PUBLIC_SUPABASE_ANON_KEY is set', 'green');
    
    log('\nCreating Supabase client...', 'blue');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    log('Testing API connection...', 'blue');
    const { data: healthData, error: healthError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);
    
    if (healthError) {
      if (healthError.code === 'PGRST116') {
        log('⚠ Table "posts" not found via Supabase API', 'yellow');
        log('   This is expected if you\'re using Prisma for database access', 'yellow');
      } else {
        log(`⚠ API query returned: ${healthError.message}`, 'yellow');
      }
    } else {
      log('✓ Supabase API connection successful!', 'green');
    }
    
    log('\nTesting Auth service...', 'blue');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      log(`⚠ Auth check returned: ${authError.message}`, 'yellow');
    } else {
      log('✓ Supabase Auth service accessible', 'green');
      if (authData.session) {
        log('  Active session found', 'blue');
      } else {
        log('  No active session (expected for verification script)', 'blue');
      }
    }
    
    log('\nTesting Storage service...', 'blue');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      log(`⚠ Storage check returned: ${storageError.message}`, 'yellow');
    } else {
      log('✓ Supabase Storage service accessible', 'green');
      const blogImagesBucket = buckets?.find(b => b.name === 'blog-images');
      if (blogImagesBucket) {
        log('✓ blog-images bucket exists', 'green');
      } else {
        log('⚠ blog-images bucket not found', 'yellow');
        log('   Run supabase-migration.sql to create it', 'yellow');
      }
    }
    
    return true;
  } catch (error: any) {
    log('❌ Supabase connection failed', 'red');
    log(`Error: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  console.clear();
  log('\n🔍 Database & Supabase Connection Verification', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const prismaResult = await testPrismaConnection();
  const supabaseResult = await testSupabaseConnection();
  
  logSection('Summary');
  
  if (prismaResult) {
    log('✓ Prisma (PostgreSQL): CONNECTED', 'green');
  } else {
    log('❌ Prisma (PostgreSQL): FAILED', 'red');
  }
  
  if (supabaseResult) {
    log('✓ Supabase Client: CONNECTED', 'green');
  } else {
    log('❌ Supabase Client: FAILED', 'red');
  }
  
  if (prismaResult && supabaseResult) {
    log('\n🎉 All connections successful!', 'green');
    log('Your database and Supabase services are properly configured.', 'green');
  } else {
    log('\n⚠️  Some connections failed. Please review the errors above.', 'yellow');
  }
  
  await prisma.$disconnect();
  process.exit(prismaResult && supabaseResult ? 0 : 1);
}

main().catch((error) => {
  log('\n❌ Unexpected error:', 'red');
  console.error(error);
  process.exit(1);
});
