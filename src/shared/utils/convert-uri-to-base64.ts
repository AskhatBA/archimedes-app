export class FileReadError extends Error {
  constructor(
    public readonly uri: string,
    cause: unknown,
  ) {
    super(
      `Failed to read file "${uri}": ${
        cause instanceof Error ? cause.message : String(cause)
      }`,
    );
    this.name = 'FileReadError';
  }
}

export const convertUriToBase64 = async (uri: string): Promise<string> => {
  try {
    const res = await fetch(uri);
    const blob = await res.blob();

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file as base64'));
      reader.onloadend = () => {
        const dataUrl = String(reader.result); // "data:<mime>;base64,AAAA..."
        const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // The file can be gone (the OS purges the picker's temp dir), unreadable,
    // or too large to fit in memory. Surface it instead of failing silently.
    throw new FileReadError(uri, error);
  }
};
