const { Command, Flags } = require("@oclif/core");
const {
  saveCredentials,
  listAccounts,
  getCredentials,
  loadAllCredentials,
  getActiveOrganization,
  saveOrganization,
  listOrganizations,
  switchOrganization,
  setOrganizationActive,
} = require("../../config/credentials");

class AWSConfigCommand extends Command {
  async run() {
    const { flags } = await this.parse(AWSConfigCommand);
    const allCredentials = loadAllCredentials();
    const envAccessKey = process.env.AWS_ACCESS_KEY;
    const envSecretKey = process.env.AWS_SECRET_KEY;
    const envRegion = process.env.AWS_REGION;

    // Ensure allCredentials.organizations is properly defined
    if (!allCredentials.organizations) {
      allCredentials.organizations = {};
    }

    if (flags.addAccount) {
      const { name, accessKey, secretKey, region } = flags;
      const finalAccessKey = accessKey || envAccessKey;
      const finalSecretKey = secretKey || envSecretKey;
      const finalRegion = region || envRegion;

      if (!name || !finalAccessKey || !finalSecretKey || !finalRegion) {
        this.error("Missing required flags or environment variables.");
      }

      const activeOrg = getActiveOrganization();
      if (!activeOrg) {
        this.error(
          "No active organization found. Please switch to an organization first."
        );
      }

      saveCredentials("aws", activeOrg, name, {
        accessKey: finalAccessKey,
        secretKey: finalSecretKey,
        region: finalRegion,
      });
      this.log(
        `AWS account '${name}' added successfully to organization '${activeOrg}'.`
      );
    }

    if (flags.switchOrg) {
      const orgName = flags.switchOrg || flags.orgName;

      if (!orgName) {
        this.error(
          "Please provide an organization name using either --switchOrg or --orgName."
        );
      }

      const account = flags.account;
      if (!orgName) {
        this.error("Missing required flag. Please provide orgName.");
      }
      switchOrganization(orgName, account);
      this.log(`Switched to AWS organization '${orgName}'.`);
    }

    if (flags.currentOrg) {
      const activeOrg = getActiveOrganization();
      if (activeOrg) {
        this.log(`Current active organization: '${activeOrg}'`);
      } else {
        this.log("No active organization set.");
      }
    }

    if (flags.listAccounts) {
      const activeOrg = getActiveOrganization();
      if (!activeOrg) {
        this.error(
          "No active organization found. Please switch to an organization first."
        );
      }

      const accounts = listAccounts("aws", activeOrg);
      if (accounts.length === 0) {
        this.log("No AWS accounts configured in the active organization.");
      } else {
        this.log(
          `AWS accounts in organization '${activeOrg}': ${accounts.join(", ")}`
        );
      }
    }

    if (flags.listOrgs) {
      const orgs = listOrganizations();
      if (orgs.length === 0) {
        this.log("No AWS organizations configured.");
      } else {
        this.log(`AWS organizations: ${orgs.join(", ")}`);
      }
    }

    if (flags.addOrg) {
      const orgName = flags.orgName;
      if (!orgName) {
        this.error("Missing required flag. Please provide orgName.");
      }
      saveOrganization(orgName);
      this.log(`AWS organization '${orgName}' added successfully.`);
    }

    if (flags.setActive) {
      const orgName = flags.orgName;
      if (!orgName) {
        this.error("Missing required flag. Please provide orgName.");
      }

      try {
        setOrganizationActive(orgName, true);
        this.log(`AWS organization '${orgName}' is now active.`);
      } catch (error) {
        this.error(`Error setting organization as active: ${error.message}`);
      }
    }

    if (flags.showAccount) {
      const orgName = getActiveOrganization();
      if (!orgName) {
        this.error(
          "No active organization found. Please set an active organization first."
        );
      }

      const account = getCredentials("aws", orgName, flags.showAccount);
      if (!account) {
        this.error(
          `AWS account '${flags.showAccount}' not found under the active organization '${orgName}'.`
        );
      } else {
        this.log(
          `AWS Account '${flags.showAccount}': ${JSON.stringify(
            account,
            null,
            2
          )}`
        );
      }
    }
  }
}

AWSConfigCommand.description = "Manage AWS account credentials";
AWSConfigCommand.flags = {
  listOrgs: Flags.boolean({
    char: "l",
    description: "List all AWS organizations",
  }),
  listAccounts: Flags.boolean({
    char: "a",
    description: "List all AWS accounts in the active organization",
  }),
  showAccount: Flags.string({
    char: "d",
    description:
      "Show details for a specific AWS account in the active organization",
  }),
  addAccount: Flags.boolean({
    char: "a",
    description: "Add a new AWS account to the active organization",
  }),
  switchOrg: Flags.string({
    char: "s",
    description: "Switch to an existing AWS organization",
    required: false,
  }),
  addOrg: Flags.boolean({
    char: "o",
    description: "Add a new AWS organization",
  }),
  orgName: Flags.string({
    char: "n",
    description: "Name of the new AWS organization",
    required: false,
    // dependsOn: ["addOrg"],
  }),
  currentOrg: Flags.boolean({
    char: "c",
    description: "Get the currently active AWS organization",
  }),
  setActive: Flags.boolean({
    description: "Set an AWS organization as active",
  }),
  name: Flags.string({
    char: "n",
    description: "Account name",
    dependsOn: ["addAccount"],
  }),
  account: Flags.string({
    char: "c",
    description: "Account details",
    dependsOn: ["switchOrg"],
  }),
  accessKey: Flags.string({
    char: "k",
    description: "AWS Access Key",
    dependsOn: ["addAccount"],
  }),
  secretKey: Flags.string({
    char: "s",
    description: "AWS Secret Key",
    dependsOn: ["addAccount"],
  }),
  region: Flags.string({
    char: "r",
    description: "AWS Region",
    dependsOn: ["addAccount"],
  }),
};

AWSConfigCommand.id = "config:aws";

module.exports = AWSConfigCommand;
