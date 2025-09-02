const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 Testing npm build...');

try {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found');
  }

  // Check if build script exists
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!packageJson.scripts || !packageJson.scripts.build) {
    throw new Error('build script not found in package.json');
  }

  console.log('✅ package.json and build script found');

  // Check if .next directory exists and clean it if needed
  if (fs.existsSync('.next')) {
    console.log('🧹 Cleaning .next directory...');
    fs.rmSync('.next', { recursive: true, force: true });
  }

  // Run the build command with a longer timeout
  console.log('🚀 Running npm run build...');
  execSync('npm run build', { 
    stdio: 'inherit',
    timeout: 120000, // 2 minutes timeout
    cwd: process.cwd()
  });
  
  console.log('✅ Build completed successfully!');
  console.log('🎉 All tests passed!');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
