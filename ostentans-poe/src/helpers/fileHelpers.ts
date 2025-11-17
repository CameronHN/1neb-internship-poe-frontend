/**
 * Downloads a blob as a file with the specified filename
 * @param blob - The blob to download
 * @param filename - The name for the downloaded file
 * @returns Promise<void>
 */
export const downloadBlob = async (blob: Blob, filename: string): Promise<void> => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.URL.revokeObjectURL(url);
};
