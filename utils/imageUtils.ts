// Utility functions for image processing and color conversion

/**
 * Convert RGB values to HEX color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");
}

/**
 * Convert HEX color string to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Calculate brightness of a color (0-255)
 */
export function calculateBrightness(r: number, g: number, b: number): number {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * Determine if text should be light or dark based on background color
 */
export function getContrastColor(r: number, g: number, b: number): "light" | "dark" {
  const brightness = calculateBrightness(r, g, b);
  return brightness > 128 ? "dark" : "light";
}

/**
 * Generate CSV content from pixel data
 */
export function generateCSV(data: Array<{ x: number; y: number; r: number; g: number; b: number; hex: string }>): string {
  const headers = ["X", "Y", "R", "G", "B", "HEX"];
  const rows = data.map((pixel) => 
    `${pixel.x},${pixel.y},${pixel.r},${pixel.g},${pixel.b},${pixel.hex}`
  );
  
  return [headers.join(","), ...rows].join("\n");
}

/**
 * Download content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string = "text/plain"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Validate image file
 */
export function validateImageFile(file: File, maxSizeInMB: number = 50): { valid: boolean; error?: string } {
  // Check if it's an image
  if (!file.type.startsWith("image/")) {
    return {
      valid: false,
      error: "File yang dipilih bukan gambar. Mohon pilih file JPG, PNG, atau format gambar lainnya.",
    };
  }

  // Check file size
  const maxSize = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${maxSizeInMB}MB. File Anda: ${formatFileSize(file.size)}`,
    };
  }

  return { valid: true };
}
