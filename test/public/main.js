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
    let stashedLayout = null;
    let preStashedTemplateResult = null;
    const runTemplate = (templateMaker)=>{
        if (preStashedTemplateResult) {
            const p = preStashedTemplateResult;
            preStashedTemplateResult = null;
            return p;
        }
        return templateMaker();
    };
    const render = async ()=>{
        if (!stashedParentElement || !thisContext || !stashedLayout) return console.warn('setState was called before component was mounted');
        if (!stashedTemplate) return console.warn('"template" was not called or called too late');
        const temp = runTemplate(()=>{
            if (!stashedTemplate || !thisContext) throw new Error('something wrong happened');
            return stashedTemplate(thisContext);
        });
        await temp.$.mount(stashedParentElement, stashedLayout, thisContext);
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
        async mount (parentElement, layout) {
            if (userDefinedStashedBeforeMountHook) await userDefinedStashedBeforeMountHook();
            stashedParentElement = parentElement;
            stashedLayout = layout;
            await render();
            if (userDefinedStashedAfterMountHook) userDefinedStashedAfterMountHook();
        },
        async destroy () {
            if (userDefinedStashedDestroyHook) await userDefinedStashedDestroyHook();
        },
        preferredSize (parentContext) {
            if (!stashedTemplate) throw new Error('"template" was not called');
            thisContext = makeContext(parentContext);
            preStashedTemplateResult = stashedTemplate(thisContext);
            return preStashedTemplateResult.$.preferredSize(thisContext);
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
async function render(rootComponent, rootElement = document.body) {
    const context = makeContext();
    rootElement.style.position = 'fixed';
    rootElement.style.top = '0';
    rootElement.style.right = '0';
    rootElement.style.bottom = '0';
    rootElement.style.left = '0';
    rootElement.style.margin = '0';
    rootElement.style.padding = '0';
    const rootLayout = {
        x: 0,
        y: 0,
        width: rootElement.clientWidth,
        height: rootElement.clientHeight
    };
    await rootComponent.$.mount(rootElement, rootLayout, context);
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
