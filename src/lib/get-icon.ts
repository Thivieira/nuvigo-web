let cachedIcons: string[] | null = null;

/**
 * Gets the weather icon filename for a given weather code
 * @param weatherCode - The weather code to get the icon for
 * @returns The filename of the corresponding weather icon
 */
export const getIcon = async (weatherCode: number): Promise<string> => {
  // Fetch icons if not cached
  if (!cachedIcons) {
    try {
      const response = await fetch('/api/weather-icons');
      const data = await response.json();
      cachedIcons = data.files;
    } catch (error) {
      console.error('Failed to fetch weather icons:', error);
      return '11000_mostly_clear_large@2x.png';
    }
  }

  // Map weather codes to their corresponding icon prefixes
  const codeMap: Record<number, string> = {
    1000: '10000', // Clear
    1100: '11000', // Mostly Clear
    1101: '11010', // Partly Cloudy
    1102: '11020', // Mostly Cloudy
    2000: '20000', // Fog
    2100: '21000', // Light Fog
    4000: '40000', // Drizzle
    4001: '40010', // Rain
    4200: '42000', // Light Rain
    4201: '42010', // Heavy Rain
    5000: '50000', // Snow
    5001: '50010', // Flurries
    5100: '51000', // Light Snow
    5101: '51010', // Heavy Snow
    6000: '60000', // Freezing Rain/Drizzle
    6001: '60010', // Freezing Rain
    6200: '62000', // Light Freezing Rain
    6201: '62010'  // Heavy Freezing Rain
  };

  // Get the icon prefix for the weather code
  const iconPrefix = codeMap[weatherCode] || '11000'; // Default to mostly clear

  // Find the first file that starts with the icon prefix
  const iconFile = cachedIcons?.find(file => file.startsWith(iconPrefix));

  return iconFile || '11000_mostly_clear_large@2x.png';
};

