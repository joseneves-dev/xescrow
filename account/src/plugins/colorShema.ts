import { definePlugin } from '/@src/utils/plugins'
import { useSettings } from '/@userStores/settings';
import { useAppColorSchemas } from '/@appStores/appColorSchemas';
import { useCookies } from '@vueuse/integrations/useCookies'

export default definePlugin(async ({ pinia }) => {
  const { get } = useCookies()

  const appColorSchemas = useAppColorSchemas(pinia)
  const settings = useSettings(pinia)

  type ColorSchemaItem = typeof appColorSchemas.colorSchema[number];
  type ColorSchema = ColorSchemaItem['type'];

  const localColorSchema = get('colorSchema') as ColorSchema
  const colorSchema = ref<ColorSchema>(localColorSchema || 'light')

  const body = document.documentElement

  if (!settings?.colorSchema) {
    settings.set({ colorSchema: colorSchema.value })
  }

  watchEffect(() => {
    const colorSchemaItem = appColorSchemas.colorSchema.find(
      item => item.type === settings?.colorSchema
    );
  
    body.classList.remove('is-dark');
  
    if (colorSchemaItem && colorSchemaItem.body_class) {
      body.classList.add(colorSchemaItem.body_class);
    }
  });
});
