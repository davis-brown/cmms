import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// One restrained scheme on every page (see DESIGN.md): cobalt for the shell and
// actions, gold as the one accent, neutrals for everything else. Slate and amber are only for event
// colours. The "on-" colours keep text on them readable.

export default createVuetify({
  components,
  directives,
  defaults: {
    VBtn: { rounded: 'lg' },
    VCard: { rounded: 'lg' },
    VTextField: { variant: 'outlined', color: 'primary' },
    VTextarea: { variant: 'outlined', color: 'primary' },
    VSelect: { variant: 'outlined', color: 'primary' },
    VAutocomplete: { variant: 'outlined', color: 'primary' },
    VFileInput: { variant: 'outlined', color: 'primary' },
    VCheckbox: { color: 'primary' },
    // The radio groups sit in table rows and never show messages
    VRadioGroup: { color: 'primary', hideDetails: true },
    VChip: { rounded: 'pill' }
  },
  theme: {
    themes: {
      light: {
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#1F3F8F',
          secondary: '#23252D',
          error: '#B3261E',
          success: '#1F7347',
          warning: '#F4BE2E',
          info: '#1F3F8F',
          gold: '#D4A72C',
          slate: '#4A5568',
          amber: '#8A5A00',
          'on-warning': '#23252D'
        }
      }
    }
  }
});
