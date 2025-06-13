# Руководство по лучшим практикам использования библиотеки валидации

## Общие рекомендации

### 1. Структура схем валидации
- Разделяйте сложные схемы на модули
- Используйте переиспользуемые компоненты схем
- Группируйте связанные поля в отдельные объекты

```javascript
// Хорошо
const addressSchema = Schema.object({
  street: Schema.string().required(),
  city: Schema.string().required(),
  postalCode: Schema.string().pattern(/^\d{5}$/).required()
});

const userSchema = Schema.object({
  name: Schema.string().required(),
  email: Schema.email().required(),
  address: addressSchema
});

// Плохо
const userSchema = Schema.object({
  name: Schema.string().required(),
  email: Schema.email().required(),
  street: Schema.string().required(),
  city: Schema.string().required(),
  postalCode: Schema.string().pattern(/^\d{5}$/).required()
});
```

### 2. Обработка ошибок
- Всегда проверяйте результат валидации
- Используйте информативные сообщения об ошибках
- Группируйте связанные ошибки

```javascript
// Хорошо
const result = schema.validate(data);
if (!result.isValid) {
  const errors = result.errors.reduce((acc, error) => {
    acc[error.path] = error.message;
    return acc;
  }, {});
  return { success: false, errors };
}

// Плохо
const result = schema.validate(data);
if (!result.isValid) {
  return { success: false, message: 'Validation failed' };
}
```

### 3. Производительность
- Кэшируйте созданные схемы
- Избегайте создания схем в циклах
- Используйте раннее прерывание валидации

```javascript
// Хорошо
const userSchema = Schema.object({...});
const validateUser = (data) => userSchema.validate(data);

// Плохо
const validateUser = (data) => Schema.object({...}).validate(data);
```

### 4. Безопасность
- Всегда валидируйте входные данные
- Используйте строгие правила валидации
- Не доверяйте клиентским данным

```javascript
// Хорошо
const passwordSchema = Schema.password()
  .minLength(8)
  .requireUppercase()
  .requireNumber()
  .requireSpecialChar();

// Плохо
const passwordSchema = Schema.string().minLength(8);
```

## Специфические рекомендации

### Валидация паролей
- Используйте сложные правила валидации
- Проверяйте на повторяющиеся символы
- Проверяйте на последовательности

```javascript
const strongPasswordSchema = Schema.password()
  .minLength(12)
  .requireUppercase()
  .requireLowercase()
  .requireNumber()
  .requireSpecialChar()
  .noRepeatingChars(3)
  .noSequentialChars(3);
```

### Валидация email
- Используйте встроенный EmailValidator
- Проверяйте домен
- Учитывайте локальную часть

```javascript
const emailSchema = Schema.email()
  .required()
  .withMessage('Пожалуйста, введите корректный email');
```

### Валидация URL
- Проверяйте протокол
- Валидируйте домен
- Учитывайте параметры

```javascript
const urlSchema = Schema.url()
  .protocols(['https'])
  .required()
  .withMessage('URL должен использовать HTTPS');
```

### Валидация цветов
- Используйте предопределенные форматы
- Проверяйте диапазоны значений
- Учитывайте прозрачность

```javascript
const colorSchema = Schema.color()
  .required()
  .withMessage('Укажите корректный цвет');
```

## Рекомендации по тестированию

### 1. Структура тестов
- Тестируйте граничные случаи
- Проверяйте все возможные ошибки
- Используйте моки для внешних зависимостей

```javascript
describe('PasswordValidator', () => {
  it('должен принимать корректный пароль', () => {
    const schema = Schema.password().minLength(8);
    expect(schema.validate('Password123!')).toBeValid();
  });

  it('должен отклонять слабый пароль', () => {
    const schema = Schema.password().minLength(8);
    expect(schema.validate('weak')).not.toBeValid();
  });
});
```

### 2. Покрытие тестами
- Стремитесь к 100% покрытию
- Тестируйте все ветви кода
- Проверяйте обработку ошибок

```javascript
// Хорошо
it('должен обрабатывать все типы ошибок', () => {
  const schema = Schema.string().required();
  expect(schema.validate(null)).toHaveError('required');
  expect(schema.validate(123)).toHaveError('type');
  expect(schema.validate('')).toHaveError('empty');
});
```

## Заключение

Следуя этим рекомендациям, вы сможете:
- Создавать более надежные и поддерживаемые схемы валидации
- Улучшить производительность вашего приложения
- Обеспечить лучшую безопасность данных
- Упростить отладку и тестирование 