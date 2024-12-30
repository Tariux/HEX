const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');


async function checkCertificate(keyPath) {
  let maxAttempts = 5;

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (maxAttempts <= 0) {
        clearInterval(interval);  // Stop checking when max attempts are exhausted
        reject(false);  // Reject the promise
      }

      try {
        // Check if file exists and is not empty
        const check = fs.readFileSync(keyPath, 'utf8');
        if (check && check !== '') {
          clearInterval(interval);  // Stop checking as we've found the file
          resolve(true);  // Resolve the promise
        }
      } catch (error) {
        // If the file doesn't exist or other error, do nothing and keep trying
      }

      maxAttempts--;  // Decrement attempts
    }, 500);  // Check every 500ms
  });
}

async function generateCertificates(keyPath, certPath) {
  // Ensure the directory exists (create it recursively if needed)
  const keyDir = path.dirname(keyPath);
  const certDir = path.dirname(certPath);

  // Create directories if they don't exist
  if (!fs.existsSync(keyDir)) {
    fs.mkdirSync(keyDir, { recursive: true });
  }

  if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
  }

  // Check if the files already exist
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return true;
  }

  // Create an OpenSSL configuration file with the necessary details
  const configPath = path.join(keyDir, 'openssl.cnf');

  // OpenSSL config template with subjectAltName for localhost and 127.0.0.1
  const configContent = `
[ req ]
default_bits        = 2048
default_keyfile     = ${keyPath}
distinguished_name  = req_distinguished_name
x509_extensions     = v3_ca

[ req_distinguished_name ]
commonName          = Common Name (e.g. server FQDN or YOUR name)
commonName_max      = 64

[ v3_ca ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1   = localhost
IP.1    = 127.0.0.1
  `;

  // Write the configuration file
  fs.writeFileSync(configPath, configContent);

  // Command to generate the SSL certificate
  const opensslCommand = `openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout ${keyPath} -out ${certPath} -subj "/CN=localhost" -config ${configPath}`;

  exec(opensslCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating certificates: ${stderr}`);
      return;
    }
    fs.unlinkSync(configPath);
  });

  if (await checkCertificate(keyPath)) {
    return true;
  } else {
    return false;
  }

}

module.exports = generateCertificates;
