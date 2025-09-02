
// Run this script once to add search tokens to existing documents
import ProductService from '../services/product.service.js';

const liquorService = new ProductService()

async function migrateLiquorProfits() {
    try {
        console.log('🚀 Starting liquor profits migration...');
        
        const result = await liquorService.addProfitValueToExistingDocuments();
        
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
migrateLiquorProfits();

// Alternative: Export for use in routes
export { migrateLiquorProfits };