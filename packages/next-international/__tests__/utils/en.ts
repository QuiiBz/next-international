export default {
  hello: 'Hello',
  'hello.world': 'Hello World!',
  weather: "Today's weather is {weather}",
  'user.description': '{name} is {years} years old',
  'namespace.hello': 'Hello',
  'namespace.subnamespace.hello': 'Hello',
  'namespace.subnamespace.hello.world': 'Hello World!',
  'namespace.subnamespace.weather': "Today's weather is {weather}",
  'namespace.subnamespace.user.description': '{name} is {years} years old',
  'only.exists.in.en': 'EN locale',
  'double.param': 'This {param} is used twice ({param})',
  'thing#zero': 'No things',
  'thing#one': 'One thing',
  'thing#other': '{count} {adjective} things',
} as const;
