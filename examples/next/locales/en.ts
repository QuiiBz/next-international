console.log('Loaded EN');

export default {
  hello: 'Hello',
  welcome: 'Hello {name}!',
  'about.you': 'Hello {name}! You have {age} yo',
  'scope.test': 'A scope',
  'scope.more.test': 'A scope',
  'scope.more.param': 'A scope with {param}',
  'scope.more.and.more.test': 'A scope',
} as const;
