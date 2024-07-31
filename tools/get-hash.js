const crypto = require('crypto');
require('dotenv').config();
const telegramBotToken = process.env.TG_BOT_TOKEN;

const data = {
  id: '123456',
  username: 'testuser',
  first_name: 'Test',
  last_name: 'User',
  photo_url: 'https://example.com/photo.jpg',
  auth_date: '1621341234'
};

const token = telegramBotToken;
const checkString = Object.keys(data)
  .sort()
  .map((key) => `${key}=${data[key]}`)
  .join('\n');

const secretKey = crypto.createHash('sha256').update(token).digest();
const hash = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

console.log(hash);