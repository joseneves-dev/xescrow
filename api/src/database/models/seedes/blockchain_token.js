export async function seedBlockchainToken(client) {
  try {
     await client.query(`
       INSERT INTO "BlockchainTokens" ("id", "blockchainId", "programId", "mint", "mintAutority", "decimals", "active" ,"createdAt", "updatedAt")
       VALUES 
            ('3d18409f-9c6c-41e0-b887-90e32839fea9', '9ee4ad29-2da9-4154-bc74-1454b49e374b', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb', '3h7Fuy1QxVfzc4ASUJ3xpNkxdDxCVr2M17qQDc5JZbVX', '2dCiamptuxWoF1Y6eBEMoXYgxSTFwGWFHZbaA9maP61v', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            ('96d2d400-0802-44ad-8063-06224608a85b', '9ee4ad29-2da9-4154-bc74-1454b49e374b', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb', '6sSMhTS9bM5dQqvNXmSUDPj9zBfANghMSCyXQPprGgAE', '2dCiamptuxWoF1Y6eBEMoXYgxSTFwGWFHZbaA9maP61v', 9, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `);
 
     console.log('Inserted data into BlockchainTokens table');

  } catch (error) {
    console.error('Error seeding BlockchainTokens table:', error);
    throw error; // Optionally rethrow the error for higher-level handling
  }
}