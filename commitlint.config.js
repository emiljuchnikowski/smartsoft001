const fs = require('fs');
const path = require('path');

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': async () => {
      return [
        2,
        'always',
        [
          ...getDirectories(path.join(__dirname, 'packages')).filter(
            (name) => name.indexOf('-e2e') === -1,
          ),
          'nx',
          'github',
          'docker',
          'release',
        ],
      ];
    },
  },
};
