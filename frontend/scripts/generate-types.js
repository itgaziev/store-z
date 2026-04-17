const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SWAGGER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const OUTPUT_FILE = path.join(__dirname, '..', 'lib', 'types', 'schema.ts');

console.log('Fetching OpenAPI schema from:', SWAGGER_URL);

try {
    execSync(
        `npx openapi-typescript ${SWAGGER_URL}/api-json -o ${OUTPUT_FILE}`,
        { stdio: 'inherit' }
    );
    console.log('✓ Types generated successfully!');
} catch (error) {
    console.error('✗ Failed to generate types:', error.message);
    process.exit(1);
}
