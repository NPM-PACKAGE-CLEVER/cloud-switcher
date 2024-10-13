---
description: A command-line tool for managing multiple cloud provider credentials efficiently with support for AWS GCP and Azure.
author: Clever Eziogor
---
# Cloud Switching CLI

- Cloud Switching is a command-line interface (CLI) tool designed to manage multiple cloud provider credentials efficiently. It supports AWS, GCP, and Azure accounts, allowing you to switch between them using a single command line. The tool provides encryption for credential storage, real-time updates, and shell aliases for ease of use.

## Features

- Multi-Cloud Support: Interact with AWS, GCP, and Azure accounts using the same CLI.
- AWS Context Switching: Manage multiple AWS organizations and accounts, switching context seamlessly.
- Encryption: Secure your credentials using AES-256-CTR encryption.
- Shell Alias Setup: Automatic setup for the cloud alias, making it easy to use commands from your terminal.
- Environment Independent: Works with any shell (bash, zsh, fish).
- Cross-Platform: Compatible with Linux, macOS, and Windows systems.

## Installation

- Make sure you have Node.js (version 14 or higher) and npm installed on your system. Then, install the CLI globally:
`npm install -g cloud-switcher`

### Post-Installation Setup
- The package automatically sets up an alias cloud for easier use. It supports the following shells:

- Bash (`~/.bashrc`)
- Zsh (`~/.zshrc`)
- Fish (`~/.config/fish/config.fish`)

> Note: If your shell is unsupported, you may need to set up the alias manually by adding:
`alias cloud='cloud config:aws` to your shell configuration file and reloading it.

## Usage

### Basic Commands
- View Help:

`cloud --help` Lists all available commands and their descriptions.

- Switch AWS Context:

`cloud --switchOrg org-name-2 --account dev` Switches AWS credentials to the specified organization and account.

- Set Organization as Active:

`cloud --setActive --orgName org-name-2` Marks an AWS organization as active.

- List Organizations:

`cloud --listOrgs` Lists all organizations in your configuration file, showing active and inactive statuses.

> Encryption: This is managed internally. Credentials are stored securely using AES-256-CTR encryption.

## AWS Configuration File Update

AWS credentials are stored in `~/.aws/credentials` and `~/.aws/config` files. The tool formats profiles using the convention `<org-name>-<account-name>`.

### Configuration

The CLI uses a data in ~/.aws/data file for managing cloud accounts. The file structure is as follows:

```
{
  "organizations": [
    {
      "name": "my-org",
      "active": true,
      "accounts": [
        {
          "name": "dev-account",
          "accessKey": "<AWS_ACCESS_KEY>",
          "secretKey": "<AWS_SECRET_KEY>",
          "region": "us-west-2"
        },
        {
          "name": "prod-account",
          "accessKey": "<AWS_ACCESS_KEY>",
          "secretKey": "<AWS_SECRET_KEY>",
          "region": "eu-west-1"
        }
      ]
    }
  ]
}

```

## Shell Alias Management

- The shell alias setup is automatic, but you can manually set it by adding:

`alias cloud='cloud config:aws'` to your shell configuration file and sourcing it:

- For Bash:
`source ~/.bashrc`

- For Zsh:
`source ~/.zshrc`

- For Fish:
`source ~/.config/fish/config.fish`

## Contributing

- We welcome contributions! Feel free to fork the repository, make your changes, and submit a pull request.

- Clone the repository:
`git clone https://github.com/yourusername/cloud-switching.git`

- Install dependencies:
`npm install`

- Test the package locally:
`npm link`


## License

- Cloud Switching CLI is licensed under the ISC License.








