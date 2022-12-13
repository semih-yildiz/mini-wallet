const dotenv = require('dotenv');
dotenv.config();

module.exports.getConfig = () => {
  const config = {
    'mode': 'Development',
    'apiPort': process.env.API_PORT,
    'mySqlHost': process.env.MYSQL_HOST,
    'mySqlPort': process.env.MYSQL_PORT,
    'mySqlDatabase': process.env.MYSQL_DATABASE,
    'mySqlUser': process.env.MYSQL_USER,
    'mySqlPassword': process.env.MYSQL_PASSWORD,
    'dialect': 'mysql',
    'pool': {
      'max': 5,
      'min': 02,
      'acquire': 30000,
      'idle': 10000
    },
    'define': {
      'underscored': true,
      'freezeTableName': true,
      'paranoid': true,
      'charset': 'utf8',
      'dialectOptions': {
        'collate': 'utf8_general_ci'
      }
    }
  };

  // Modify for Production
  if (process.env.NODE_ENV === 'production') {
    config.MODE = 'Production';
  }

  return config;
};
