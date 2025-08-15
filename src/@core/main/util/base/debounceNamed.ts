import sleep from "@core/main/util/base/sleep";

export default function debounceNamed(func: any, timeout = 300) {
    let timers: any = {}

    return async (name: string, ...args: any) => {
        sleep(Math.random() * 100)
        clearTimeout(timers[name])
        timers[name] = setTimeout(() => {
            // @ts-ignore
            func.apply(this, args);
        }, timeout)
        setTimeout(() => {
          // delete timers[name]
        }, timeout * 2)
    }
}
