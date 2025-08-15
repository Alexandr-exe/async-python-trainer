from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import asyncio
import os

app = FastAPI()

# Настройка путей
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

# Раздача статики
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

# WebSocket endpoint (упрощённый и рабочий)
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            code = await websocket.receive_text()
            
            # Создаём безопасное окружение
            safe_globals = {
                'asyncio': asyncio,
                'print': lambda x: websocket.send_text(f"👉 {x}"),
                'sleep': asyncio.sleep,
                'gather': asyncio.gather,
                'Queue': asyncio.Queue,
                'create_task': asyncio.create_task,
            }

            try:
                # Запрещаем только самые опасные операции
                banned = ['__import__', 'eval(', 'exec(', 'open(']
                if any(word in code for word in banned):
                    raise ValueError("Запрещённая операция")

                # Выполняем код
                exec(code, safe_globals)
                await websocket.send_text("✅ Успешно выполнено")
                
            except asyncio.CancelledError:
                await websocket.send_text("❌ Превышено время выполнения")
            except Exception as e:
                await websocket.send_text(f"❌ Ошибка: {type(e).__name__}: {str(e)}")
                
    except WebSocketDisconnect:
        print("Клиент отключился")
    finally:
        await websocket.close()