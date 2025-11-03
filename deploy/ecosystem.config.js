module.exports = {
  apps: [
    {
      name: 'acquismart-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/acquismart',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'https://www.acquismart.ai/api'
      },
      error_file: '/var/www/acquismart/logs/frontend-error.log',
      out_file: '/var/www/acquismart/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'acquismart-backend',
      script: 'npm',
      args: 'run dev',
      cwd: '/var/www/acquismart/backend/svc-catalog',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: '/var/www/acquismart/logs/backend-error.log',
      out_file: '/var/www/acquismart/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
