
export function formatSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//Determine the appropriate unit based on the size
    const i = Math.floor(Math.log(bytes) / Math.log(k));

//Formate into 2 decimal places and round to 2 decimal places
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


export const generateUUID = () => {
    return crypto.randomUUID();
};

