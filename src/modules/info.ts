import App from "@core/main/lib/app"

const modules = [
    require('@core/main/register'),
    require('@core/captcha/register'),
    require('@core/ui/register'),
    require('@core/catalog/register'),
    require('@core/sale/register'),
    require('@core/faq/register'),
    require('@core/search/register'),
    require('@core/geo/register'),
    require('@core/company/register'),
    require('@core/user/register'),
    require('@core/notice/register'),
    require('@core/promo/register'),
    require('@core/page/register'),
    require('@core/webview/register'),
    require('@core/offer/register'),
    require('./app/register'),
]
export default modules

export const app = new App();

app.registerModules(modules)


