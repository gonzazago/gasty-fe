# Configuración de la API

El frontend ahora está configurado para comunicarse con el backend a través de la API REST.

## Variables de Entorno

Para configurar la URL del backend, crea un archivo `.env.local` en la raíz del proyecto frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Si no se define esta variable, por defecto se usará `http://localhost:3000`.

## Estructura de la API

### Endpoints Disponibles

- **GET** `/api/expenses` - Obtener todos los gastos
- **POST** `/api/expenses` - Crear un nuevo gasto
- **GET** `/api/expenses/:id` - Obtener un gasto por ID
- **GET** `/api/banks` - Obtener todos los bancos
- **POST** `/api/banks` - Crear un nuevo banco

### Notas Importantes

1. **Tarjetas (Cards)**: Actualmente las tarjetas siguen usando datos mock, ya que el backend aún no tiene endpoints para Cards. Esto se puede implementar más adelante.

2. **Campos Faltantes**: Algunos campos del frontend no están disponibles en el backend aún:
   - `fixed` (gasto fijo/variable)
   - `split` (cuotas)
   - `totalIncome` (ingresos por mes)
   - `color` para bancos

3. **Agrupación por Mes**: Los meses se generan automáticamente agrupando los gastos por fecha. No hay un concepto de "mes" como entidad separada en el backend.

## Uso

Los actions en `src/actions/` ahora hacen llamadas HTTP reales a la API. Asegúrate de que el backend esté corriendo antes de usar el frontend.

```bash
# En gasty-app-be
npm run dev

# En gasty-app-fe (en otra terminal)
npm run dev
```

