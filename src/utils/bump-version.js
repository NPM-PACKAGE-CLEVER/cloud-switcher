const fs = require('fs');
const path = require('path');

// Dynamically find the path to package.json relative to the script's directory
const packageJsonPath = path.resolve(__dirname, '../../package.json');

// Log the path to verify it's correct
console.log('Package.json path:', packageJsonPath);

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

    // Read the file again to verify the update
    const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`Updated version in package.json: ${updatedPackageJson.version}`);
} catch (error) {
    console.error('Error reading or writing package.json:', error);
    process.exit(1);
}
