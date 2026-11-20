const baseErrorMsg = "Uknown Error";
const connectionErrorMsg = "Connection error";

export function errorMsgHelper(error: unknown): string {
  if ("message" in (error as {})) {
    const e = error as { message: string };
    if (e.message === "Failed to fetch") return connectionErrorMsg;
    return JSON.parse(e.message)?.message ?? baseErrorMsg;
  }

  return baseErrorMsg;
}
