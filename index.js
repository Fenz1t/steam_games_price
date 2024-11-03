import express from "express";
import gameRoutes from "./routes/gameRoutes.js";

const PORT = 3000;
const app = express();
app.use(express.static("public"));
// Настройка статического HTML-файла для ввода ID

// Маршрут для получения информации о цене игры по AppID
app.use('/', gameRoutes);
// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});