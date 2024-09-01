export function getNumberWithinString(text: string | null | undefined): number {
  return Number(text?.replaceAll(/\D/gu, ''));
}
