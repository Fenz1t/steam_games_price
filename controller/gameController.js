import axios from "axios";

// Метод для получения цены по AppID

const getAppIdByName = async (name) => {
  try {
    const url = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";
    const response = await axios.get(url);

    // Проверяем успешность ответа
    if (
      !response.data ||
      !response.data.applist ||
      !response.data.applist.apps
    ) {
      throw new Error("Failed to retrieve app list");
    }

    const apps = response.data.applist.apps;
    const formattedName = name.trim().toLowerCase();

    // Ищем точное соответствие названия, если оно есть
    let app = apps.find((app) => app.name.toLowerCase() === formattedName);

    // Если точного соответствия нет, ищем по включению подстроки
    if (!app) {
      app = apps.find((app) => app.name.toLowerCase().includes(formattedName));
    }

    return app ? app.appid : null;
  } catch (error) {
    console.error("Error fetching app ID:", error.message);
    return null;
  }
};

// Метод для получения цены по AppID или названию игры
export const getPrice = async (req, res) => {
  let appid = req.query.appid;
  const name = req.query.name;

  // Если appid не передан, пробуем получить его по названию игры
  if (!appid) {
    if (!name) {
      return res
        .status(400)
        .json({ error: "Please provide an appid or game name" });
    }
    appid = await getAppIdByName(name);

    if (!appid) {
      return res.status(404).json({ error: "Game not found" });
    }
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
        price: priceInfo ? priceInfo.final / 100 : "Free",
        currency: priceInfo ? priceInfo.currency : "",
        discount: priceInfo ? priceInfo.discount_percent : 0,
        website: gameData.website,
        pc_requirements: gameData.pc_requirements,
      };

      res.json(result);
    } else {
      res.status(404).json({ error: "Game not found" });
    }
  } catch (error) {
    console.error("Error fetching game data:", error.message);
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
};
