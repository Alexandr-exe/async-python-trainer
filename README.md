# Асинхронный тренажёр Python

Интерактивный тренажёр для изучения async/await в Python.

## Особенности
- 10 уровней сложности
- Встроенный веб-редактор кода
- Интерактивные подсказки
- Визуализация выполнения

## Запуск
```bash
pip install fastapi uvicorn aiofiles websockets
uvicorn server:app --reload
```
Откройте http://localhost:8000 в браузере.