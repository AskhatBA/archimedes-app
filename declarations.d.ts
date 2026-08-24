declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare module '@env' {
  export const API_URL: string;
  /** Base URL of the web payment page loaded in the WebView. */
  export const PAYMENT_WEB_URL: string;
}
