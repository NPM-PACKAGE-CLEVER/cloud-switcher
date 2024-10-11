const fs = require("fs");
const path = require("path");
const os = require("os");
const { encrypt, decrypt, updateAWSFiles } = require("../utils/helper");

const configPath = path.join(os.homedir(), ".aws", "data");

// Load credentials from the config file
const loadAllCredentials = () => {
  try {
    if (!fs.existsSync(configPath)) {
      return {};
    }
    const rawData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error loading credentials:", error.message);
    console.error("Raw Data:", rawData); // Log the raw data for debugging
    return {};
  }
};

// Save credentials to the config file with encryption
const saveCredentials = (provider, orgName, accountName, credentials) => {
  let allCredentials = loadAllCredentials();
  if (!allCredentials[provider]) {
    allCredentials[provider] = {};
  }
  if (!allCredentials[provider][orgName]) {
    allCredentials[provider][orgName] = {};
  }
  const encryptedCredentials = {
    accessKey: encrypt(credentials.accessKey),
    secretKey: encrypt(credentials.secretKey),
    region: encrypt(credentials.region),
  };
  allCredentials[provider][orgName][accountName] = encryptedCredentials;
  fs.writeFileSync(configPath, JSON.stringify(allCredentials, null, 2));
};

// Save organization to the config file
const saveOrganization = (orgName) => {
  let allCredentials = loadAllCredentials();
  if (!allCredentials["aws"]) {
    allCredentials["aws"] = {};
  }
  if (!allCredentials["aws"][orgName]) {
    allCredentials["aws"][orgName] = {};
    fs.writeFileSync(configPath, JSON.stringify(allCredentials, null, 2));
  }
};

// Retrieve credentials with decryption
const getCredentials = (provider, orgName, accountName) => {
  const allCredentials = loadAllCredentials();
  const account =
    allCredentials[provider] &&
    allCredentials[provider][orgName] &&
    allCredentials[provider][orgName][accountName];
  if (account) {
    return {
      accessKey: decrypt(account.accessKey),
      secretKey: decrypt(account.secretKey),
      region: decrypt(account.region),
    };
  }
  return null;
};

// List all accounts for a specific provider and organization
const listAccounts = (provider, orgName) => {
  const allCredentials = loadAllCredentials();
  return allCredentials[provider] && allCredentials[provider][orgName]
    ? Object.keys(allCredentials[provider][orgName])
    : [];
};

// List all organizations
const listOrganizations = () => {
  const allCredentials = loadAllCredentials();
  return allCredentials.aws ? Object.keys(allCredentials.aws) : [];
};

// Switch to an existing organization
const switchOrganization = (orgName, accountName) => {
    let allCredentials = loadAllCredentials();
  
    // if (typeof orgName !== "string" || typeof accountName !== "string") {
    //   throw new Error("Organization and account names must be strings.");
    // }
  
    // Ensure the organization and account exist
    if (!allCredentials.aws || !allCredentials.aws[orgName]) {
      throw new Error(`Organization '${orgName}' not found.`);
    }
    if (!allCredentials.aws[orgName][accountName]) {
      throw new Error(`Account '${accountName}' not found under organization '${orgName}'.`);
    }
  
    // Decrypt credentials for the selected account
    const { accessKey, secretKey, region } = getCredentials("aws", orgName, accountName);
  
    // Mark the organization as active
    Object.keys(allCredentials.aws).forEach((name) => {
      allCredentials.aws[name].active = name === orgName;
    });
  
    // Save the updated credentials to ~/.aws/data
    fs.writeFileSync(configPath, JSON.stringify(allCredentials, null, 2));
  
    // Update AWS credentials and config files
    updateAWSFiles(orgName, accountName, accessKey, secretKey, region);
  };

// Get the active organization
const getActiveOrganization = () => {
  const allCredentials = loadAllCredentials();
  const activeOrgs = Object.keys(allCredentials.aws || {}).filter(
    (org) => allCredentials.aws[org].active
  );
  return activeOrgs.length > 0 ? activeOrgs[0] : null; // Return the first active organization or null if none found
};

const setOrganizationActive = (orgName, isActive) => {
    let allCredentials = loadAllCredentials();
    if (!allCredentials.aws || !allCredentials.aws[orgName]) {
      throw new Error(`Organization '${orgName}' not found.`);
    }
  
    // Set the specified organization as active/inactive
    Object.keys(allCredentials.aws).forEach((name) => {
      allCredentials.aws[name].active = (name === orgName) && isActive;
    });
  
    fs.writeFileSync(configPath, JSON.stringify(allCredentials, null, 2));
  };
  

module.exports = {
  saveCredentials,
  listAccounts,
  getCredentials,
  loadAllCredentials,
  getActiveOrganization,
  saveOrganization,
  listOrganizations,
  switchOrganization,
  setOrganizationActive,
};
