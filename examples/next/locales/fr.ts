import { defineLocale } from '.';

console.log('Loaded FR');

export default defineLocale({
  hello: 'Bonjour',
  welcome: 'Bonjour {name}!',
  'about.you': 'Bonjour {name}! Vous avez {age} ans',
});
