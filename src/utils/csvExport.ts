/**
 * Convert an array of objects to CSV format
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: Record<keyof T, string>
): string {
  if (data.length === 0) return "";

  // Get headers from first object or use provided headers
  const keys = Object.keys(data[0]) as (keyof T)[];
  const headerRow = keys
    .map((key) => (headers && headers[key]) || String(key))
    .join(",");

  // Convert data rows
  const dataRows = data.map((item) =>
    keys
      .map((key) => {
        const value = item[key];
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) return "";
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Download a CSV file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Export data as CSV file
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Record<keyof T, string>
): void {
  const csv = convertToCSV(data, headers);
  downloadCSV(csv, filename);
}

