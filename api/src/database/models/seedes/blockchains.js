export async function seedBlockchains(client) {
  try {
     await client.query(`
       INSERT INTO "Blockchains" ("id", "programId", "decimals", "active", "createdAt", "updatedAt")
       VALUES 
          ('9ee4ad29-2da9-4154-bc74-1454b49e374b', '11111111111111111111111111111111', '9', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
     `);
 
     console.log('Inserted data into Blockchains table');

  } catch (error) {
    console.error('Error seeding Blockchains table:', error);
    throw error; // Optionally rethrow the error for higher-level handling
  }
}