export const blobToBase64 = async (blob: Blob): Promise<string> => {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.readAsDataURL(blob);
    
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};