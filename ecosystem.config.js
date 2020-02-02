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
      user: 'root',
      host: 'celsian.pepe.asia',
      ref: 'origin/master',
      repo: 'https://github.com/pepebecker/pinyin-telegram.git',
      path: '/home/pepe/apps/production/pinyin-telegram',
      'post-deploy': 'source ~/.profile && npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
