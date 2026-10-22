import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  components,
  directives,
  // Vuetify 2's underlined inputs rather than Vuetify 3's filled boxes
  defaults: {
    VTextField: { variant: 'underlined' },
    VTextarea: { variant: 'underlined' },
    VSelect: { variant: 'underlined' },
    VAutocomplete: { variant: 'underlined' },
    VFileInput: { variant: 'underlined' },
    VCheckbox: { color: 'primary' },
    // The radio groups sit in table rows and never show messages
    VRadioGroup: { color: 'primary', hideDetails: true }
  },
  // Vuetify 2's colours, so buttons and the calendar look the same as before
  theme: {
    themes: {
      light: {
        colors: { primary: '#1976D2', secondary: '#424242' }
      }
    }
  }
});
