module.exports = {
  '*.{ts,tsx,js,jsx,json,md}': ['yarn lint', 'git add'],
  '*.{ts,tsx}': ['jest --bail --findRelatedTests']
};
