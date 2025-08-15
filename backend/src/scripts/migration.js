// migration.js - Run this script once to add search tokens to existing documents
import SuperMarketService from '../services/superMarket.service.js';

const marketService = new SuperMarketService();

async function migrateSearchTokens() {
    try {
        console.log('🚀 Starting search tokens migration...');
        
        const result = await marketService.addSearchTokensToExistingDocuments();
        
        console.log('✅ Migration Results:');
        console.log(`   📝 Total documents: ${result.total}`);
        console.log(`   ✅ Successfully processed: ${result.processed}`);
        console.log(`   ❌ Errors: ${result.errors}`);
        
        if (result.errors === 0) {
            console.log('🎉 Migration completed successfully!');
        } else {
            console.log('⚠️  Migration completed with some errors. Check logs above.');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('💥 Migration failed:', error.message);
        process.exit(1);
    }
}

// Run migration
migrateSearchTokens();

// Alternative: Export for use in routes
export { migrateSearchTokens };