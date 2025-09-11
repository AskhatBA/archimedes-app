export const convertUriToBase64 = async (uri: string): Promise<string> => {
  const res = await fetch(uri);
  const blob = await res.blob();

  const result = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file as base64'));
    reader.onloadend = () => {
      const dataUrl = String(reader.result); // "data:<mime>;base64,AAAA..."
      const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });

  return result;
};
