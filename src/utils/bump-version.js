const fs = require('fs');
const path = require('path');

// Dynamically find the path to package.json relative to the script's directory
const packageJsonPath = path.resolve(__dirname, '../../package.json'); // Adjust this if needed

try {
    // Read the package.json file
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Split the version into parts
    const versionParts = packageJson.version.split('.').map(Number);

    // Increment the patch version (last number)
    versionParts[2] += 1;

    // Join the parts back into a version string
    packageJson.version = versionParts.join('.');

    // Write the updated package.json back to the file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log(`Version bumped to ${packageJson.version}`);
} catch (error) {
    console.error('Error reading or writing package.json:', error);
    process.exit(1);
}
