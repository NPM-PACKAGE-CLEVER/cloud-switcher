const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

function getShellConfigFile() {
  const shell = process.env.SHELL;

  if (shell?.includes('bash')) {
    return path.join(os.homedir(), '.bashrc');
  } else if (shell?.includes('zsh')) {
    return path.join(os.homedir(), '.zshrc');
  } else if (shell?.includes('fish')) {
    return path.join(os.homedir(), '.config', 'fish', 'config.fish');
  }

  console.warn('Shell not supported for automatic alias setup. Please set the alias manually.');
  process.exit(0);
}

function addAliasToShellConfig(filePath) {
  const aliasCommand = "\nalias cloud='cloud config:aws'\n";
  try {
    fs.appendFileSync(filePath, aliasCommand);
    console.log(`Alias added to ${filePath}. Reloading shell...`);

    // Automatically reload the shell
    reloadShell();
  } catch (error) {
    console.error(`Error adding alias: ${error.message}`);
  }
}

function reloadShell() {
  const shell = process.env.SHELL;
  let reloadCommand = '';

  // Define the appropriate reload command based on the shell type
  if (shell.includes('bash')) {
    reloadCommand = 'source ~/.bashrc';
  } else if (shell.includes('zsh')) {
    reloadCommand = 'source ~/.zshrc';
  } else if (shell.includes('fish')) {
    reloadCommand = 'source ~/.config/fish/config.fish';
  }

  // Execute the reload command
  if (reloadCommand) {
    exec(reloadCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error reloading shell: ${stderr}`);
        return;
      }
      console.log(stdout);
      console.log('Shell configuration reloaded successfully.');
    });
  } else {
    console.warn('Automatic reload not supported for your shell. Please reload manually.');
  }
}

const shellConfigFile = getShellConfigFile();
addAliasToShellConfig(shellConfigFile);
