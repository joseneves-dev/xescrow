export async function seedCountries(client) {
  try {
     await client.query(`
       INSERT INTO "Countries" ("id", "name", "iso", "code", "active", "createdAt", "updatedAt")
       VALUES 
            (gen_random_uuid(), 'portugal', 'PT',  '+351', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (gen_random_uuid(), 'france', 'FR',  '+51', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (gen_random_uuid(), 'swizterland', 'CH',  '+41', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
     `);
 
     console.log('Inserted data into Countries table');

  } catch (error) {
    console.error('Error seeding Countries table:', error);
    throw error; // Optionally rethrow the error for higher-level handling
  }
}