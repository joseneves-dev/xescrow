export async function seedCurrencies(client) {
    try {
        await client.query(`
            INSERT INTO "Currencies" ("id", "name", "symbol", "active", "createdAt", "updatedAt")
            VALUES 
                (gen_random_uuid(), 'Euro', 'EUR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                (gen_random_uuid(), 'US Dollar', 'USD', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
           `);
       
        console.log('Inserted data into Currencies table');
      
    } catch (error) {
        console.error('Error seeding Currencies table:', error);
        throw error; // Optionally rethrow the error for higher-level handling
    }
}