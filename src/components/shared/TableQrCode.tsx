'use client';

import { QRCodeSVG } from 'qrcode.react';

/**
 * Real, scannable QR code for a table (Figma 467:1241 / 467:1155).
 * Generated in code instead of a static PNG, so it stays crisp at any size
 * (SVG), is actually scannable by a phone camera, and downloads as vector.
 *
 * The value is the URL a guest's phone opens after scanning: the customer
 * ordering app with the table pre-selected. TODO(api): the ordering host is
 * hardcoded to the kishare production host; pass the real per-branch order
 * URL once the backend serves it.
 */
export function tableQrValue(tableName: string): string {
  const table = encodeURIComponent(tableName);
  return `https://kishare.kodevio.com/?table=${table}`;
}

export function TableQrCode({ tableName, size = 154 }: { tableName: string; size?: number }) {
  return (
    <QRCodeSVG
      value={tableQrValue(tableName)}
      size={size}
      // White quiet zone so scanners read it reliably (spec: 4 modules;
      // 2 reads well at 154px and matches the Figma QR's tight padding).
      marginSize={2}
      bgColor='#FFFFFF'
      fgColor='#000000'
      level='M'
    />
  );
}
