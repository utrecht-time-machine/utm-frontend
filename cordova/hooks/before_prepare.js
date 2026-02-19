#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (context) {
  const envPath = path.join(context.opts.projectRoot, '.env');
  console.log('Loading .env from:', envPath);

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('.env file content:', envContent);
  } else {
    console.log('.env file not found');
  }

  require('dotenv').config({ path: envPath });

  const configPath = path.join(context.opts.projectRoot, 'config.xml');
  const configContent = fs.readFileSync(configPath, 'utf8');

  const licenseKey = process.env.GEOLOCATION_LICENSE_KEY || '';
  const updatedContent = configContent.replace(/\$GEOLOCATION_LICENSE_KEY/g, licenseKey);

  if (licenseKey) {
    console.log(
      `Geolocation license key injected from environment variable (${licenseKey.length} characters)`,
    );
  } else {
    console.log('Geolocation license key: empty (no GEOLOCATION_LICENSE_KEY env var set)');
  }

  if (configContent !== updatedContent) {
    console.log('config.xml updated with license key');
    fs.writeFileSync(configPath, updatedContent);

    // Restore the placeholder after the build to keep secrets out of git
    process.on('exit', () => {
      const restoredContent = updatedContent.replace(licenseKey, '$GEOLOCATION_LICENSE_KEY');
      fs.writeFileSync(configPath, restoredContent);
      console.log('config.xml placeholder restored for git');
    });
  } else {
    console.log('config.xml: no changes needed');
  }
};
