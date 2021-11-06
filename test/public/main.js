function Div(params) {
    let stashedEl = null;
    const $ = {
        async mount (el, context) {
            const div = document.createElement('div');
            stashedEl = div;
            if (params.on) for(const eventName in params.on){
                const value = params.on[eventName];
                if (value) div.addEventListener(eventName, value);
            }
            if (params.style) for(const key in params.style){
                const value = params.style[key];
                if (value) div.style[key] = value;
            }
            el.appendChild(div);
            if (params.children) for (const child of params.children){
                await child.$.mount(div, context);
            }
        },
        async destroy () {
            if (!stashedEl) throw new Error('destroy was called before mount');
            if (params.on) for(const eventName in params.on){
                const value = params.on[eventName];
                stashedEl.removeEventListener(eventName, value);
            }
            if (params.children) for (const child of params.children){
                await child.$.destroy();
            }
            stashedEl?.remove();
            stashedEl = null;
        }
    };
    return {
        getDomElement () {
            if (!stashedEl) throw new Error('can not get dom element before it is mounted or after it is destroyed');
            return stashedEl;
        },
        $
    };
}
function Text(text) {
    let stashedEl = null;
    return {
        $: {
            mount (el) {
                const span = document.createElement('span');
                span.textContent = text;
                stashedEl = span;
                el.appendChild(span);
                return Promise.resolve();
            },
            destroy () {
                stashedEl?.remove();
                return Promise.resolve();
            }
        }
    };
}
function App() {
    const { $ , template , setState  } = lubber();
    let showCounter = true;
    template(()=>Div({
            children: showCounter ? [
                Counter()
            ] : [],
            style: {
                width: '100px',
                height: '100px',
                background: 'red'
            },
            on: {
                click () {
                    setState(()=>showCounter = !showCounter
                    );
                }
            }
        })
    );
    return {
        $
    };
}
function Counter() {
    const { $ , template , setState , onDestroy  } = lubber();
    let count = 0;
    const interval = setInterval(()=>{
        console.log('hi');
        setState(()=>count++
        );
    }, 1000);
    onDestroy(async ()=>{
        await new Promise((resolve)=>setTimeout(resolve, 3000)
        );
        clearInterval(interval);
    });
    template(()=>Text(`Hello, World! ${count}`)
    );
    return {
        $
    };
}
render(App());
