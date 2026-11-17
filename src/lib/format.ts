import { mediaPath, mediaUrl } from './mediaUrl';
import type { Lang } from '../data/types';
import { translate, locale } from '../i18n';

export function fmt(lang: Lang, input: string | number): string {
  let s = String(input);
  if (lang === 'en') {
    s = s
      .replace(/(\d)\.(\d{3})(?!\d)/g, '$1,$2')
      .replace(/(\d),(\d{1,2})(?!\d)/g, '$1.$2')
      .replace(/\s?a\.C\./g, ' BC')
      .replace(/\s?d\.C\./g, ' AD');
  } else {
    s = s.replace(/(\d),(\d{3})(?!\d)/g, '$1.$2');
  }
  return s;
}

export const fmtNum = (lang: Lang, n: number) => n.toLocaleString(locale(lang));

export const fmtKm = (lang: Lang, km: number) =>
  (km < 10 ? Number(km.toFixed(1)) : Math.round(km)).toLocaleString(locale(lang)) +
  ' ' +
  translate(lang, 'km');

export function fmtDur(lang: Lang, s: number) {
  const m = Math.round(s / 60);
  if (m < 60) return m + ' ' + translate(lang, 'min');
  return (
    Math.floor(m / 60) +
    ' ' +
    translate(lang, 'h') +
    ' ' +
    String(m % 60).padStart(2, '0') +
    ' ' +
    translate(lang, 'min')
  );
}

export const norm = (s: string | undefined | null) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export function sizedThumb(src: string, w: number) {
  if (!src) return src;
  const local = mediaPath(src);
  if (local.startsWith('/media/')) {
    const tag = w <= 160 ? 120 : w <= 400 ? 320 : 800;
    return mediaUrl(
      local.replace(/-(?:120|320|800)\.webp$/i, `-${tag}.webp`).replace(/\.(jpe?g|png)$/i, `-${tag}.webp`),
    );
  }
  if (src.includes('/960px-') && w <= 160) return src.replace('/960px-', '/120px-');
  const full =
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/([0-9a-f]\/[0-9a-f]{2})\/([^/?#]+\.(?:jpe?g|png))(?:[?#].*)?$/i.exec(
      src,
    );
  if (full) return `${full[1]}/thumb/${full[2]}/${full[3]}/${w}px-${full[3]}`;
  if (!/(upload|thumb)\.wikimedia\.org\/.+\/thumb\//.test(src)) return src;
  return src.replace(/\/(\d+)px-([^/]+)$/, (m, n, rest) => (Number(n) > w ? `/${w}px-${rest}` : m));
}

export const thumbUrl = (src: string) => sizedThumb(src, 120);
