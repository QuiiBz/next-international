function log(type: keyof Pick<typeof console, 'error' | 'warn'>, message: string) {
  if (process.env.NODE_ENV !== 'production') {
    console[type](`[next-international] ${message}`);
  }
}

export function warn(message: string) {
  log('warn', message);
}

export function error(message: string) {
  log('error', message);
}
