const patterns: Array<[RegExp, string]> = [
  [/sk-[A-Za-z0-9_-]+/g, "sk-***"],
  [/Bearer\s+\S+/gi, "Bearer ***"],
  (/[\w.-]+@[\w.-]+/g as unknown as [RegExp, string])[0],
];

export function maskSensitive(input: string) {
  let out = input;
  out = out.replace(/[\w.-]+@[\w.-]+/g, "***@***");
  out = out.replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "***.***.***.***");
  out = out.replace(/[A-Za-z]:\\[^\s]+/g, "***");
  out = out.replace(/Bearer\s+\S+/gi, "Bearer ***");
  out = out.replace(/sk-[A-Za-z0-9_-]+/g, "sk-***");
  return out;
}
