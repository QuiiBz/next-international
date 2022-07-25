function log(type: keyof Pick<typeof console, 'error' | 'warn'>, message: string) {
  if (process.env.NODE_ENV !== 'production') {
    console[type](`[next-international] ${message}`);
  }

  return null;
}

export const warn = (message: string) => log('warn', message);
export const error = (message: string) => log('error', message);
