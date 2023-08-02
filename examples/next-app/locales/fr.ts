// import { defineLocale } from '.';

console.log('Loaded FR');

export default {
  hello: 'Bonjour',
  welcome: 'Bonjour {name}!',
  'about.you': 'Bonjour {name}! Vous avez {age} ans',
  'scope.test': 'Un scope',
  'scope.more.test': 'Un scope',
  'scope.more.param': 'Un scope avec un {param}',
  'scope.more.and.more.test': 'Un scope',
  'scope.more.stars#one': '1 étoile sur GitHub',
  'scope.more.stars#other': '{count} étoiles sur GitHub',
  'missing.translation.in.fr': '', // Comment to test locale fallback
  'cows#one': 'Une vache',
  'cows#other': '{count} vaches',
} as const;
