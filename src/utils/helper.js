const crypto = require("crypto");
const path = require('path');
const fs = require('fs');
const os = require('os');


// Ensure the key is exactly 32 bytes for aes-256-ctr
const key = Buffer.from('12345678901234567890123456789012', 'utf8'); // 32 bytes

const encrypt = (data) => {
    // Generate a random IV (16 bytes)
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);

    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    return { iv: iv.toString("hex"), content: encrypted };
};

const decrypt = (encrypted) => {
    try {
        const iv = Buffer.from(encrypted.iv, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);

        let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error.message);
        return null;
    }
};

// Helper function to update ~/.aws/credentials and ~/.aws/config
const updateAWSFiles = (orgName, accountName, accessKey, secretKey, region) => {
    const credentialsPath = path.join(os.homedir(), ".aws", "credentials");
    const configPath = path.join(os.homedir(), ".aws", "config");
  
    // Format the profile name using organization and account name
    const profileName = `${orgName}-${accountName}`;
  
    // AWS credentials file content
    const credentialsContent = `
  [${profileName}]
  aws_access_key_id = ${accessKey}
  aws_secret_access_key = ${secretKey}
  region = ${region}
  `;
  
    // AWS config file content
    const configContent = `
  [profile ${profileName}]
  region = ${region}
  output = json
  `;
  
    // Ensure ~/.aws directory exists
    const awsDir = path.join(os.homedir(), ".aws");
    if (!fs.existsSync(awsDir)) {
      fs.mkdirSync(awsDir);
    }
  
    // Write or update ~/.aws/credentials
    fs.writeFileSync(credentialsPath, credentialsContent, { flag: "w" });
  
    // Write or update ~/.aws/config
    fs.writeFileSync(configPath, configContent, { flag: "w" });
  };


module.exports = {
    encrypt,
    decrypt,
    updateAWSFiles
  };