'use client';

import Image from 'next/image';
import { useTheme } from 'nextra-theme-docs';
import { useEffect, useState } from 'react';

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [src, setSrc] = useState('/logo-black.png');

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      setSrc('/logo-white.png');
      return;
    }

    setSrc('/logo-black.png');
  }, [resolvedTheme]);

  return <Image src={src} alt="Next International logo" priority width={240} height={200} />;
};

export default Logo;
