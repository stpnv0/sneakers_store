# sneakers/Dockerfile

# Используем официальный образ Node.js
FROM node:18

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json (если есть) для установки зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект в рабочую директорию контейнера
COPY . .

# Открываем порт 5173 для Vite
EXPOSE 5173

# Команда для запуска приложения на Vite
CMD ["npm", "run", "dev"]