#!/usr/bin/env bash
set -euo pipefail

# #region clone
git clone https://github.com/emiljuchnikowski/smartsoft.git
cd smartsoft
# #endregion

echo "between the regions"

# #region install
# install everything
npm ci
# #endregion
