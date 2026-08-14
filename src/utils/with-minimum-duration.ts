export async function withMinimumDuration<T>(
  fn: () => Promise<T>,
  minimumDurationMs: number,
): Promise<T> {
  const [result] = await Promise.all([
    fn(),
    new Promise((resolve) => setTimeout(resolve, minimumDurationMs)),
  ]);

  return result;
}
