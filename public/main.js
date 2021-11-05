function gui() {
    let stashedTemplate = null;
    let stashedParentElement = null;
    let stashedDestroyHook = null;
    const render = async ()=>{
        if (!stashedParentElement) return console.warn('setState was called before component was mounted');
        if (!stashedTemplate) return console.warn('setState was called before "template"');
        const temp = stashedTemplate();
        await temp.$.mount(stashedParentElement);
        stashedDestroyHook = temp.$.destroy;
    };
    function template(tmp) {
        if (stashedTemplate) throw new Error('"template" can only be called once per component');
        stashedTemplate = tmp;
    }
    async function setState(cb) {
        await cb();
        if (!stashedDestroyHook) return console.warn('setState was called before "template"');
        await stashedDestroyHook();
        await render();
    }
    let userDefinedStashedDestroyHook = null;
    function onDestroy(cb) {
        userDefinedStashedDestroyHook = async ()=>{
            await cb();
        };
    }
    const $ = {
        async mount (el) {
            stashedParentElement = el;
            await render();
        },
        async destroy () {
            if (userDefinedStashedDestroyHook) await userDefinedStashedDestroyHook();
        }
    };
    return {
        template,
        $,
        setState,
        onDestroy
    };
}
function render(rootComponent) {
    rootComponent.$.mount(document.body);
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
function Div(params) {
    let stashedEl = null;
    return {
        $: {
            async mount (el) {
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
                    await child.$.mount(div);
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
            }
        }
    };
}
function App() {
    const { $ , template , setState  } = gui();
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
    const { $ , template , setState , onDestroy  } = gui();
    let count = 0;
    const interval = setInterval(()=>setState(()=>count++
        )
    , 1000);
    onDestroy(()=>clearInterval(interval)
    );
    template(()=>Text(`Hello, World! ${count}`)
    );
    return {
        $
    };
}
render(App());
