function makeContext(inheritFrom) {
    const keys = {
    };
    function setKey(id, value) {
        keys[id] = value;
    }
    function getKey(id) {
        const value = keys[id];
        if (value) return value;
        if (!inheritFrom) return null;
        return inheritFrom.getKey(id);
    }
    return {
        setKey,
        getKey
    };
}
function lubber() {
    let thisContext = null;
    let stashedTemplate = null;
    let stashedParentElement = null;
    let stashedDestroyHook = null;
    const render = async ()=>{
        if (!stashedParentElement || !thisContext) return console.warn('setState was called before component was mounted');
        if (!stashedTemplate) return console.warn('setState was called before "template"');
        const temp = stashedTemplate(thisContext);
        await temp.$.mount(stashedParentElement, thisContext);
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
    let userDefinedStashedAfterMountHook = null;
    function afterMount(fn) {
        userDefinedStashedAfterMountHook = fn;
    }
    let userDefinedStashedBeforeMountHook = null;
    function beforeMount(fn) {
        userDefinedStashedBeforeMountHook = async ()=>{
            await fn();
        };
    }
    const $ = {
        async mount (parentElement, parentContext) {
            if (userDefinedStashedBeforeMountHook) await userDefinedStashedBeforeMountHook();
            stashedParentElement = parentElement;
            thisContext = makeContext(parentContext);
            await render();
            if (userDefinedStashedAfterMountHook) userDefinedStashedAfterMountHook();
        },
        async destroy () {
            if (userDefinedStashedDestroyHook) await userDefinedStashedDestroyHook();
        }
    };
    return {
        template,
        $,
        setState,
        onDestroy,
        beforeMount,
        afterMount
    };
}
function render(rootComponent) {
    rootComponent.$.mount(document.body, makeContext());
}
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
