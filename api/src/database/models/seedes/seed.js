// seed.js

import pkg from 'pg';

import { seedLanguages } from './languages.js'; // Import the specific seed function
import { seedCountries } from './countries.js';
import { seedCurrencies } from './currencies.js'
import { seedBlockchains } from './blockchains.js';
import { seedBlockchainMetaData } from './blockchain_meta_data.js';
import { seedBlockchainToken } from './blockchain_token.js';
import { seedTokenMetaData }from './token_meta_data.js'

export default async function seedDatabase() {
  const { Client } = pkg;

  // Configure the PostgreSQL client
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'app',
    password: '2391991',
    port: 5432, // Default PostgreSQL port
  });

  try {
    // Connect to the PostgreSQL server
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Call the specific seed function (e.g., seedLanguages)
    await seedLanguages(client);
    await seedCountries(client);
    await seedCurrencies(client);
    await seedBlockchains(client);
    await seedBlockchainMetaData(client);
    await seedBlockchainToken(client);
    await seedTokenMetaData(client);
    console.log('Data seeding completed successfully.');

  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
  } finally {
    // Close the PostgreSQL client
    await client.end();
    console.log('Disconnected from PostgreSQL');
  }
}

// Call the seed function to start the seeding process
seedDatabase();