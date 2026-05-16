export async function getPrayerTimes(city: string, method: number = 2) {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  try {
    const url = `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${city}&country=UZ&method=${method}`;
    const resp = await fetch(url);
    const data = await resp.json();
    
    if (data.code === 200) {
      return {
        timings: data.data.timings,
        hijri: data.data.date.hijri,
      };
    }
  } catch (err) {
    console.error('Prayer times fetch error:', err);
  }

  // Fallback (Tashkent default)
  return {
    timings: {
      Fajr: '04:00', Sunrise: '05:30', Dhuhr: '12:30',
      Asr: '16:00', Maghrib: '19:30', Isha: '21:00',
      Imsak: '03:50', Midnight: '00:45',
    },
    hijri: null,
  };
}
