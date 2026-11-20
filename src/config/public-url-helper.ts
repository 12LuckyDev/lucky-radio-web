import { config } from "./config";

export function publicUrlHelper(url: string): string {
  const { subpath } = config;
  return subpath !== "" ? `${subpath}${url}` : url;
}
