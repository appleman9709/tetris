# Судоку Тетрис - PWA

Мобильная игра Судоку Тетрис с поддержкой PWA (Progressive Web App).

## 🚀 PWA Возможности

### ✅ Установка как приложение
- Приложение можно установить на домашний экран мобильного устройства
- Работает в автономном режиме благодаря Service Worker
- Быстрая загрузка благодаря кэшированию

### 📱 Поддержка устройств
- **Android**: Установка через Chrome/Edge
- **iOS**: Установка через Safari (iOS 11.3+)
- **Desktop**: Установка через Chrome/Edge/Firefox

### 🎯 Favicon и иконки
- Favicon: `cover.png` используется как основная иконка
- Иконки для PWA: различные размеры (72x72 до 512x512)
- Поддержка Apple Touch Icons для iOS

## 🛠 Технические детали

### PWA Компоненты
- **Manifest**: `public/manifest.json` - метаданные приложения
- **Service Worker**: `public/sw.js` - кэширование и офлайн работа
- **Icons**: `public/icons/` - иконки разных размеров
- **Favicon**: `public/favicon.png` - основная иконка

### Vite PWA Plugin
Проект использует `vite-plugin-pwa` для автоматической генерации:
- Service Worker с Workbox
- Манифест приложения
- Регистрация PWA функций

## 📦 Установка и запуск

```bash
# Установка зависимостей
npm install

# Разработка
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 🔧 Настройка PWA

### Изменение иконок
1. Замените `cover.png` на вашу иконку
2. Скопируйте файл в `public/favicon.png`
3. Скопируйте файл в `public/icons/` с нужными размерами
4. Пересоберите проект: `npm run build`

### Изменение метаданных
Отредактируйте `public/manifest.json`:
```json
{
  "name": "Название приложения",
  "short_name": "Короткое название",
  "description": "Описание приложения",
  "theme_color": "#цвет_темы",
  "background_color": "#цвет_фона"
}
```

## 🌐 Развертывание

### Vercel (рекомендуется)
```bash
# Установка Vercel CLI
npm i -g vercel

# Развертывание
vercel
```

### Другие платформы
- **Netlify**: Перетащите папку `dist` в Netlify
- **GitHub Pages**: Загрузите содержимое `dist` в репозиторий
- **Firebase Hosting**: Используйте Firebase CLI

## 📱 Тестирование PWA

### Chrome DevTools
1. Откройте DevTools (F12)
2. Перейдите в раздел "Application"
3. Проверьте "Manifest" и "Service Workers"

### Lighthouse
1. Откройте DevTools
2. Перейдите в раздел "Lighthouse"
3. Запустите аудит PWA

### Мобильное тестирование
1. Откройте приложение на мобильном устройстве
2. В Chrome/Safari найдите кнопку "Добавить на главный экран"
3. Установите приложение и протестируйте офлайн режим

## 🎨 Кастомизация

### Цвета темы
Измените цвета в `public/manifest.json`:
- `theme_color`: цвет строки состояния
- `background_color`: цвет загрузки

### Иконки
Все иконки находятся в `public/icons/`:
- `icon-72x72.png` - минимальный размер
- `icon-512x512.png` - максимальный размер
- Рекомендуется квадратные изображения

## 🔍 Отладка

### Service Worker
```javascript
// В консоли браузера
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('SW registrations:', registrations);
});
```

### Кэш
```javascript
// Очистка кэша
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

## 📄 Лицензия

MIT License - свободное использование и модификация.
