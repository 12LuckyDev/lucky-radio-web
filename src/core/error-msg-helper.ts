const baseErrorMsg = "Uknown Error";

export function errorMsgHelper(error: unknown): string {
  if ("message" in (error as {})) {
    const e = error as { message: string };
    return JSON.parse(e.message)?.message ?? baseErrorMsg;
  }

  return baseErrorMsg;
}
