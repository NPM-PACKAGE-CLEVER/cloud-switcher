const { run } = require('@oclif/core');
run()
  .then(require('pretty-error').start())
  .catch(require('@oclif/core/handle'));

