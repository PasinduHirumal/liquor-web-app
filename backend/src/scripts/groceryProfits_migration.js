
// Run this script once to add search tokens to existing documents
import OtherProductService from '../services/otherProduct.service.js';

const groceryService = new OtherProductService();

async function migrateGroceryProfits() {
    try {
        console.log('🚀 Starting liquor items profit migration...');
        
        const result = await groceryService.addProfitValueToExistingDocuments();
        
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
migrateGroceryProfits();

// Alternative: Export for use in routes
export { migrateGroceryProfits };