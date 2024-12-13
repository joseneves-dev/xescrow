export async function seedLanguages(client) {
  try {
     await client.query(`
       INSERT INTO "Languages" ("id", "name", "iso","active", "createdAt", "updatedAt")
       VALUES 
         (gen_random_uuid(), 'english', 'en', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
         (gen_random_uuid(), 'espanhol', 'es', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
         (gen_random_uuid(), 'france', 'fr', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
         (gen_random_uuid(), 'portugues', 'pt', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     `);
 
     console.log('Inserted data into Languages table');

  } catch (error) {
    console.error('Error seeding Languages table:', error);
    throw error; // Optionally rethrow the error for higher-level handling
  }
}