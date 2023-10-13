'use client';

import Image from 'next/image';
import { useTheme } from 'nextra-theme-docs';

const Logo = () => {
  const { resolvedTheme } = useTheme();

  if (resolvedTheme === 'dark') {
    return <Image src="/logo-white.png" alt="Next International logo" priority width={240} height={200} />;
  }

  return <Image src="/logo-black.png" alt="Next International logo" priority width={240} height={200} />;
};

export default Logo;
