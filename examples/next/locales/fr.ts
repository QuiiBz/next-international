import { defineLocale } from '.';

console.log('Loaded FR');

export default defineLocale({
  hello: 'Bonjour',
  welcome: 'Bonjour {name}!',
  'about.you': 'Bonjour {name}! Vous avez {age} ans',
  'scope.test': 'Un scope',
  'scope.more.test': 'Un scope',
  'scope.more.param': 'Un scope avec un {param}',
  'scope.more.and.more.test': 'Un scope',
});
