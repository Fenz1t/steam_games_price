import axios from 'axios';

// Метод для получения цены по AppID
export const getPrice = async (req, res) => {
  const appid = req.query.appid;

  if (!appid) {
    return res.status(400).json({ error: 'Please provide an appid' });
  }

  try {
    const url = `http://store.steampowered.com/api/appdetails?appids=${appid}&cc=RU`;
    const response = await axios.get(url);
    const data = response.data[appid];

    if (data.success) {
      const gameData = data.data;
      const priceInfo = gameData.price_overview;

      const result = {
        name: gameData.name,
        price: priceInfo ? priceInfo.final / 100 : 'Free',
        currency: priceInfo ? priceInfo.currency : '',
        discount: priceInfo ? priceInfo.discount_percent : 0,
        website: gameData.website,
        pc_requirements: gameData.pc_requirements,
      };

      res.json(result);
    } else {
      res.status(404).json({ error: 'Game not found' });
    }
  } catch (error) {
    console.error('Error fetching game data:', error.message);
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
};
