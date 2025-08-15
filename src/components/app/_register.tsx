import App from "@core/main/lib/app";

export default function register(app: App) {
    app.addPresets('UiCard', require('./presets/ui-card'))
    app.registerComponent('AppBonusInfoChunk', require('./chunk/bonus-info').default)
}
