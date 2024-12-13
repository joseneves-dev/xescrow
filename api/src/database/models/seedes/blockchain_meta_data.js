export async function seedBlockchainMetaData(client) {
    try {
        await client.query(`
            INSERT INTO "BlockchainMetaData" ("id", "blockchainId", "name", "symbol", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid(), '9ee4ad29-2da9-4154-bc74-1454b49e374b', 'Solana', 'SOL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
           `);
       
        console.log('Inserted data into BlockchainMetaData table');
      
    } catch (error) {
        console.error('Error seeding BlockchainMetaData table:', error);
        throw error; // Optionally rethrow the error for higher-level handling
    }
}