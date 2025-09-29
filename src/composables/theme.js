import { ref, reactive } from "vue";
import { Dark, setCssVar, LocalStorage } from "quasar";

// Auto-import all theme files
const themeModules = import.meta.glob("src/themes/*.js", { eager: true });
const mapThemes = Object.entries(themeModules).reduce((acc, [path, module]) => {
    const themeName = path.split("/").pop().replace(".js", "");
    module.default.active = false
    return { ...acc, [themeName]: module.default };
}, {});

const current = ref(localStorage.getItem("theme") || "real-response");
const themes = reactive(mapThemes);
const theme = ref({ ...themes[current.value] }); // copy to ensure new reference


function setTheme(themeName) {
    // Reset all themes to inactive
    Object.keys(themes).forEach(key => {
        themes[key].active = false;
    });

    if (themes[themeName]) {
        current.value = themeName;
        theme.value = { ...themes[themeName] }; // ✅ create new object reference
        themes[themeName].active = true

        // Apply colors using Quasar setCssVar
        Object.entries(theme.value.colors).forEach(([key, value]) => {
            setCssVar(key, value);
        });

        localStorage.setItem("theme", themeName);
    }
}

// Ensure initial theme is valid
if (!themes[current.value]) {
    current.value = Object.keys(themes)[0];
}

// Change theme to all open tabs
window.addEventListener('storage', (event) => {
    if (event.key === 'theme' && event.newValue ) {
        try {
            setTheme(event.newValue)
        } catch (err) {
            console.error('Invalid theme JSON:', err)
        }
    }

    if( event.key === 'isDark' ){
        Dark.set(LocalStorage.getItem('isDark'))
    }
})

export function useTheme() {
    setTheme(current.value);
    return {
        current,
        themes,
        theme,
        setTheme,
        reset(){
            setTheme("real-response")
        }
    };
}
