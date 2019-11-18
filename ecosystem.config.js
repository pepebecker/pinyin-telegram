module.exports = {
  apps : [{
    name: 'pinyin-telegram',
    script: 'index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: 'pepe',
      host: 'celsian.pepebecker.com',
      ref: 'origin/master',
      repo: 'https://github.com/pepebecker/pinyin-telegram.git',
      path: '/home/pepe/apps/production/pinyin-telegram',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
