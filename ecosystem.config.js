const source_profile = 'source $HOME/.profile && '

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    // First application
    {
      name      : 'pinyin-telegram',
      script    : 'index.js',
      env_production : {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'pepe',
      host : 'celsian.pepebecker.com',
      ref  : 'origin/master',
      repo : 'https://github.com/pepebecker/pinyin-telegram.git',
      path : '/home/pepe/apps/production/pinyin-telegram',
      'post-deploy': source_profile + 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'pepe',
      host : 'celsian.pepebecker.com',
      ref  : 'origin/master',
      repo : 'https://github.com/pepebecker/pinyin-telegram.git',
      path : '/home/pepe/apps/development/pinyin-telegram',
      'post-deploy': source_profile + 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
