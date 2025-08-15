export const levels = [
  /* Уровень 1: Основы async/await */
  {
    title: "Знакомство с асинхронностью",
    theory: `
      <section class="theory-block">
        <h2>📌 Синхронный vs Асинхронный код</h2>
        
        <div class="analogy">
          <p>Представьте, что вы в кафе:</p>
          <ul>
            <li><strong>Синхронный подход:</strong> Вы стоите в очереди и ждёте заказ, не делая ничего другого.</li>
            <li><strong>Асинхронный подход:</strong> Делаете заказ, садитесь за стол (программа продолжает работу), получаете уведомление, когда заказ готов.</li>
          </ul>
        </div>

        <h3>Ключевые элементы:</h3>
        <pre>import asyncio

async def make_coffee():
    print("Начинаем готовить кофе")
    await asyncio.sleep(3)  # ⏳ Ожидание без блокировки
    print("Кофе готов!")</pre>

        <table class="term-table">
          <tr><td><code>async def</code></td><td>Объявляет асинхронную функцию</td></tr>
          <tr><td><code>await</code></td><td>"Пауза" для ожидания результата</td></tr>
          <tr><td><code>asyncio.sleep()</code></td><td>Аналог time.sleep(), но не блокирует поток</td></tr>
        </table>
      </section>

      <div class="warning">
        <p>🔹 <strong>Важно:</strong> Без <code>await</code> функция "зависнет" на операции!</p>
      </div>
    `,
    task: "Напишите функцию, которая ждёт 2 секунды и выводит 'Завершено'",
    code: `import asyncio\n\nasync def task():\n    # Ваш код здесь`,
    hint: "Используйте await asyncio.sleep(2) перед print",
    check: code => code.includes("await asyncio.sleep(2)") && 
                  code.includes("print(")
  },

  /* Уровень 2: Параллельные задачи */
  {
    title: "Параллелизм с create_task",
    theory: `
      <section class="theory-block">
        <h2>🧑‍🍳 Параллельное выполнение задач</h2>
        
        <div class="comparison">
          <div class="wrong">
            <h3>❌ Последовательный подход (5 сек):</h3>
            <pre>await task1()  # 3 сек\nawait task2()  # 2 сек</pre>
          </div>
          <div class="right">
            <h3>✅ Параллельный подход (3 сек):</h3>
            <pre>t1 = asyncio.create_task(task1())\nt2 = asyncio.create_task(task2())\nawait t1\nawait t2</pre>
          </div>
        </div>

        <h3>Как это работает?</h3>
        <ol>
          <li><code>create_task</code> запускает корутину "в фоне"</li>
          <li>Задачи выполняются конкурентно</li>
          <li><code>await</code> ждёт завершения конкретной задачи</li>
        </ol>

        <div class="code-sample">
          <h3>Пример с логгированием:</h3>
          <pre>async def task(id, delay):
    print(f"Задача {id} началась")
    await asyncio.sleep(delay)
    print(f"Задача {id} завершена")

async def main():
    t1 = asyncio.create_task(task(1, 2))
    t2 = asyncio.create_task(task(2, 1))
    await t1  # Ждём только первую задачу</pre>
          <p>Вывод: <code>Задача 1 началась → Задача 2 началась → Задача 2 завершена → Задача 1 завершена</code></p>
        </div>
      </section>
    `,
    task: "Запустите две задачи: первая печатает 'A' через 1 сек, вторая 'B' через 2 сек",
    code: `import asyncio\n\nasync def print_a():\n    # Ваш код\n\nasync def print_b():\n    # Ваш код\n\nasync def main():\n    # Ваш код здесь`,
    hint: "Используйте create_task для каждой функции",
    check: code => (code.match(/create_task\(/g) || []).length >= 2
  },

  /* Уровень 3: Группировка задач */
  {
    title: "Управление группой задач",
    theory: `
      <section class="theory-block">
        <h2>👨‍👩‍👧‍👦 asyncio.gather</h2>
        
        <div class="use-case">
          <h3>Когда использовать?</h3>
          <p>Когда нужно:</p>
          <ul>
            <li>Запустить несколько задач одновременно</li>
            <li>Дождаться завершения <strong>всех</strong> задач</li>
            <li>Обработать результаты вместе</li>
          </ul>
        </div>

        <h3>Пример: Загрузка файлов</h3>
        <pre>async def download(url):
    print(f"Начало загрузки {url}")
    await asyncio.sleep(1)  # Эмуляция загрузки
    return f"Данные {url}"

async def main():
    urls = ["url1.com", "url2.com", "url3.com"]
    results = await asyncio.gather(*[download(url) for url in urls])
    print(results)  # ['Данные url1.com', ...]</pre>

        <table class="features">
          <tr><th>Особенность</th><th>Описание</th></tr>
          <tr><td>Порядок результатов</td><td>Соответствует порядку задач, а не времени выполнения</td></tr>
          <tr><td>Обработка ошибок</td><td>При <code>return_exceptions=True</code> ошибки не прерывают выполнение</td></tr>
        </table>
      </section>
    `,
    task: "Запустите 3 задачи параллельно (каждая ждёт 1 сек и возвращает число)",
    code: `import asyncio\n\nasync def task(n):\n    # Ваш код\n\nasync def main():\n    # Ваш код здесь`,
    hint: "Используйте gather(task(1), task(2), task(3))",
    check: code => code.includes("gather(") && 
                  (code.match(/task\(/g) || []).length >= 3
  },

  /* Уровень 4: Обработка ошибок */
  {
    title: "Исключения в асинхронном коде",
    theory: `
      <section class="theory-block">
        <h2>🚨 Ошибки и asyncio</h2>
        
        <div class="error-types">
          <h3>Типичные сценарии:</h3>
          <ul>
            <li><strong>Ошибка в одной задаче</strong> - как не сломать всё приложение?</li>
            <li><strong>Таймауты</strong> - что делать, если задача зависла?</li>
            <li><strong>Отмена задач</strong> - как остановить выполнение?</li>
          </ul>
        </div>

        <h3>Пример: Ловим исключения</h3>
        <pre>async def risky_operation():
    await asyncio.sleep(1)
    raise ValueError("Что-то пошло не так!")

async def main():
    try:
        await risky_operation()
    except ValueError as e:
        print(f"Поймали ошибку: {e}")</pre>

        <h3>Ошибки в gather</h3>
        <pre>async def main():
    tasks = [task1(), task2()]  # Пусть task2 упадёт с ошибкой
    results = await asyncio.gather(
        *tasks,
        return_exceptions=True  # Важно!
    )
    print(results)  # [результат, ошибка]</pre>
      </section>
    `,
    task: "Обработайте ошибку в асинхронной задаче (исключение после await)",
    code: `import asyncio\n\nasync def fail_task():\n    # Ваш код\n\nasync def main():\n    # Ваш код здесь`,
    hint: "Используйте try/except вокруг await",
    check: code => code.includes("try:") && 
                  code.includes("except ") && 
                  code.includes("await ")
  },

  /* Уровень 5: Асинхронные файлы */
  {
    title: "Работа с файловой системой",
    theory: `
      <section class="theory-block">
        <h2>📂 aiofiles: Файлы без блокировок</h2>
        
        <div class="why-async">
          <h3>Проблема обычных файловых операций:</h3>
          <p>Стандартные <code>open()/read()/write()</code> блокируют поток выполнения, что сводит на нет всю асинхронность.</p>
        </div>

        <h3>Решение: aiofiles</h3>
        <pre>import aiofiles

async def write_log(message):
    async with aiofiles.open('log.txt', mode='a') as f:
        await f.write(message + "\\n")

async def read_log():
    async with aiofiles.open('log.txt', mode='r') as f:
        content = await f.read()
        print(content)</pre>

        <table class="file-modes">
          <tr><th>Режим</th><th>Описание</th></tr>
          <tr><td><code>'r'</code></td><td>Чтение (по умолчанию)</td></tr>
          <tr><td><code>'w'</code></td><td>Перезапись файла</td></tr>
          <tr><td><code>'a'</code></td><td>Дозапись в конец</td></tr>
        </table>
      </section>
    `,
    task: "Создайте файл 'data.txt' и запишите в него строку 'Тест'",
    code: `import aiofiles\n\nasync def create_file():\n    # Ваш код здесь`,
    hint: "Используйте aiofiles.open() с режимом 'w'",
    check: code => code.includes("aiofiles.open(") && 
                  code.includes("'w'") && 
                  code.includes("await f.write(")
  },

  /* Уровень 6: Вебсокеты */
  {
    title: "Реальное время с WebSocket",
    theory: `
      <section class="theory-block">
        <h2>🌐 WebSocket: Двустороннее общение</h2>
        
        <div class="vs-http">
          <h3>WebSocket vs HTTP:</h3>
          <ul>
            <li><strong>HTTP</strong> - как письма: запрос → ответ → соединение закрывается</li>
            <li><strong>WebSocket</strong> - как телефонный звонок: постоянное соединение</li>
          </ul>
        </div>

        <h3>Базовый клиент:</h3>
        <pre>from websockets import connect

async def chat_client():
    async with connect("wss://echo.websocket.org") as ws:
        await ws.send("Привет!")
        reply = await ws.recv()
        print(f"Ответ сервера: {reply}")</pre>

        <h3>Где применяется?</h3>
        <div class="applications">
          <div class="app-card">
            <h4>💬 Чаты</h4>
            <p>Мгновенная доставка сообщений</p>
          </div>
          <div class="app-card">
            <h4>🎮 Онлайн-игры</h4>
            <p>Синхронизация действий игроков</p>
          </div>
        </div>
      </section>
    `,
    task: "Отправьте сообщение 'Ping' на wss://echo.websocket.org и выведите ответ",
    code: `from websockets import connect\n\nasync def send_ping():\n    # Ваш код здесь`,
    hint: "Используйте await ws.send() и await ws.recv()",
    check: code => code.includes("connect(") && 
                  code.includes("await ws.send(") && 
                  code.includes("await ws.recv(")
  },

  /* Уровень 7: Очереди задач */
  {
    title: "Асинхронные очереди",
    theory: `
      <section class="theory-block">
        <h2>📭 asyncio.Queue: Обмен данными</h2>
        
        <div class="queue-concept">
          <h3>Концепция очереди:</h3>
          <p>Производители (producers) добавляют элементы в очередь, потребители (consumers) забирают их для обработки.</p>
        </div>

        <h3>Пример: Обработка задач</h3>
        <pre>queue = asyncio.Queue()

async def producer():
    for i in range(3):
        await queue.put(f"Задача-{i}")
        print(f"Добавлено: Задача-{i}")

async def consumer():
    while True:
        item = await queue.get()
        print(f"Обработка: {item}")
        queue.task_done()  # Важно!</pre>

        <h3>Ключевые методы:</h3>
        <table class="queue-methods">
          <tr><th>Метод</th><th>Описание</th></tr>
          <tr><td><code>put(item)</code></td><td>Добавить элемент</td></tr>
          <tr><td><code>get()</code></td><td>Получить элемент</td></tr>
          <tr><td><code>task_done()</code></td><td>Подтвердить обработку</td></tr>
          <tr><td><code>join()</code></td><td>Ждать завершения всех задач</td></tr>
        </table>
      </section>
    `,
    task: "Создайте 2 производителей (каждый добавляет 2 числа) и 1 потребителя",
    code: `import asyncio\n\nqueue = asyncio.Queue()\n\nasync def producer(id):\n    # Ваш код\n\nasync def consumer():\n    # Ваш код\n\nasync def main():\n    # Ваш код здесь`,
    hint: "Используйте queue.put() и queue.get()",
    check: code => code.includes("Queue()") && 
                  (code.match(/put\(/g) || []).length >= 2 &&
                  code.includes("get()")
  },

  /* Уровень 8: Семафоры */
  {
    title: "Ограничение параллелизма",
    theory: `
      <section class="theory-block">
        <h2>🚦 Semaphore: Контроль доступа</h2>
        
        <div class="semaphore-analogy">
          <h3>Аналогия:</h3>
          <p>Семафор - это как турникет в метро: пропускает только ограниченное количество людей одновременно.</p>
        </div>

        <h3>Пример: Ограничение API-запросов</h3>
        <pre>sem = asyncio.Semaphore(3)  # Максимум 3 одновременных запроса

async def fetch_data(url):
    async with sem:  # "захватываем" слот
        print(f"Начало загрузки {url}")
        await asyncio.sleep(1)  # Эмуляция запроса
        print(f"Завершено: {url}")</pre>

        <h3>Где использовать?</h3>
        <ul>
          <li>Ограничение подключений к БД</li>
          <li>Защита от перегрузки API</li>
          <li>Управление нагрузкой на ресурсы</li>
        </ul>
      </section>
    `,
    task: "Запустите 5 задач с ограничением в 2 параллельных выполнения",
    code: `import asyncio\n\nasync def task(id):\n    # Ваш код\n\nasync def main():\n    # Ваш код здесь`,
    hint: "Используйте Semaphore(2) и async with sem",
    check: code => code.includes("Semaphore(") && 
                  code.includes("async with sem") &&
                  (code.match(/task\(/g) || []).length >= 5
  },

  /* Уровень 9: Интеграция с синхронным кодом */
  {
    title: "Работа с потоками",
    theory: `
      <section class="theory-block">
        <h2>🔄 asyncio.to_thread</h2>
        
        <div class="sync-async">
          <h3>Когда нужно?</h3>
          <p>Когда приходится использовать синхронные библиотеки (например, для работы с файлами или вычислений).</p>
        </div>

        <h3>Пример: "Обёртка" для time.sleep</h3>
        <pre>import time

def sync_sleep(seconds):  # Обычная синхронная функция
    time.sleep(seconds)
    return "Готово"

async def main():
    result = await asyncio.to_thread(sync_sleep, 2)
    print(result)  # Через 2 секунды</pre>

        <div class="warning">
          <h3>⚠️ Ограничения:</h3>
          <ul>
            <li>Не подходит для CPU-bound задач (лучше multiprocessing)</li>
            <li>Добавляет накладные расходы на переключение контекста</li>
          </ul>
        </div>
      </section>
    `,
    task: "Запустите time.sleep(2) через to_thread и выведите результат",
    code: `import asyncio\nimport time\n\ndef sync_task():\n    # Ваш код\n\nasync def main():\n    # Ваш код здесь`,
    hint: "Используйте await asyncio.to_thread(sync_task)",
    check: code => code.includes("to_thread(") && 
                  code.includes("time.sleep(")
  },

  /* Уровень 10: Финальный проект */
  {
    title: "Асинхронный веб-краулер",
    theory: `
      <section class="theory-block">
        <h2>🕷️ Краулер: Собираем данные</h2>
        
        <div class="crawler-architecture">
          <h3>Архитектура решения:</h3>
          <ol>
            <li><strong>Очередь URL</strong> - asyncio.Queue для управления задачами</li>
            <li><strong>Семафор</strong> - ограничение одновременных запросов</li>
            <li><strong>aiohttp</strong> - асинхронные HTTP-запросы</li>
            <li><strong>aiofiles</strong> - сохранение результатов</li>
          </ol>
        </div>

        <h3>Примерный код:</h3>
        <pre>async def crawler(url):
    async with semaphore:
        async with session.get(url) as response:
            data = await response.text()
            await save_to_file(url, data)

async def main():
    urls = ["url1.com", "url2.com", ...]
    tasks = [crawler(url) for url in urls]
    await asyncio.gather(*tasks)</pre>

        <div class="bonus">
          <h3>Дополнительно можно добавить:</h3>
          <ul>
            <li>Парсинг ссылок из HTML</li>
            <li>Рекурсивный обход сайта</li>
            <li>Обработку ошибок и повторы</li>
          </ul>
        </div>
      </section>
    `,
    task: "Скачайте 3 страницы с ограничением 2 одновременных запроса",
    code: `import aiohttp\nimport asyncio\n\nsemaphore = asyncio.Semaphore(2)\n\nasync def fetch(url):\n    # Ваш код\n\nasync def main():\n    urls = [...]\n    # Ваш код здесь`,
    hint: "Используйте gather + Semaphore",
    check: code => code.includes("Semaphore(") && 
                  code.includes("aiohttp.ClientSession(") && 
                  code.includes("gather(")
  }
];