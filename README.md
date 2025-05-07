Утилита по загрузке датасетов для определения типа изображения.

## Использование

`git clone https://github.com/akrasnov87/yolo-load-dataset-image-types load-datasets`
`cd load-datasets`
`npm install`

### Подготовка данных
Из базы данных источника, при помощи запроса:
<pre>
SELECT 	at.c_const,
		'https://source.domain/release/file?id=' || a.fn_file AS c_url
FROM core.cd_attachments AS a
INNER JOIN core.cs_attachment_types AS at ON a.fn_type = at.id
WHERE at.c_const = 'DOCUMENT'
LIMIT 10000
</pre>

достаём обекты: `DOCUMENT`, `METER`, `OBJECT`, `SEAL`.

Результаты этих выборок требуется поместить в каталог `./data`, текущего проекта, как:
* document.csv
* meter.csv
* object.csv
* seal.csv

### Загрузка изображений
Выполняем команду `npm start` с заранее настроенным `.env` файлом, как:
<pre>
OUTPUT_DATSETS=./output
OUTPUT_SAVE_LIMIT=10000
</pre>

Где:
* OUTPUT_DATSETS: string - выходной каталог;
* OUTPUT_SAVE_LIMIT: integer - лимит выборки данных.

Дополнительно можно пропустить обработку всех объектов и явно указать, только один. Для этого требуется указать ещё одну переменную:
* OUTPUT_SAVE_TYPE: string - тип данных для сохранения из каталога `data` (document, meter, object или seal).

По завершению выполнения команды в каталоге `./output/types` (корневую папку передаём в `OUTPUT_DATSETS`) будут храниться файлы со скаченными изображениями.

### Формирование датасета для yolo

Выполняем команду `npm run yolo` с дополнительными переменными:

* INPUT_FOR_YOLO_DATA: string - каталог с результатом обработки `OUTPUT_SAVE_TYPE`;
* OUTPUT_YOLO: string - каталог для сохранения результата конвертирования.

<pre>
INPUT_FOR_YOLO_DATA=./output/types
OUTPUT_YOLO=./output/yolo/image-type-4
</pre>

После завершения выполнения команды в папке `./output/yolo/image-type-4` будут данные для обучения в [yolo](https://docs.ultralytics.com/ru/datasets/classify/#folder-structure-example).

По умолчанию, размер изображений 64 пиксиля, это значение можно изменить передав переменную:
* IMAGE_RESIZE: integer - размер изображения в пикселях (для сжатия используется [sharp](https://www.npmjs.com/package/sharp))