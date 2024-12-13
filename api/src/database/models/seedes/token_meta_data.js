export async function seedTokenMetaData(client) {
    try {
        await client.query(`
            INSERT INTO "BlockchainTokenMetaData" ("id", "tokenId", "name", "symbol", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid(), '96d2d400-0802-44ad-8063-06224608a85b', 'XEscrow Euro', 'xeEUR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                (gen_random_uuid(), '3d18409f-9c6c-41e0-b887-90e32839fea9', 'XEscrow US Dollar', 'xeUSD', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
       `);
       
        console.log('Inserted data into BlockchainTokenMetaData table');
      
    } catch (error) {
        console.error('Error seeding BlockchainTokenMetaData table:', error);
        throw error; // Optionally rethrow the error for higher-level handling
    }
}