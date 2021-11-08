function setPosition(element, layout) {
    element.style.position = 'absolute';
    element.style.width = `${layout.width}px`;
    element.style.height = `${layout.height}px`;
    element.style.left = `${layout.x}px`;
    element.style.top = `${layout.y}px`;
}
function repeat(text, number) {
    let newText = '';
    for(let i = 1; i <= number; i++)newText += text;
    return newText;
}
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
async function createLubberApplication(params) {
    const context = makeContext();
    const rootElement = typeof params.rootElement === 'string' ? document.querySelector(params.rootElement) : params.rootElement ?? document.body;
    if (!rootElement) throw new Error(`could not locate dom element "${rootElement}" in the DOM tree`);
    rootElement.style.position = 'fixed';
    rootElement.style.top = '0';
    rootElement.style.right = '0';
    rootElement.style.bottom = '0';
    rootElement.style.left = '0';
    rootElement.style.margin = '0';
    rootElement.style.padding = '0';
    const styleEl = document.createElement('style');
    styleEl.textContent = `* { user-select: none; overflow: hidden; }`;
    document.head.appendChild(styleEl);
    const rootLayout = {
        x: 0,
        y: 0,
        width: rootElement.clientWidth,
        height: rootElement.clientHeight
    };
    await params.rootWidget.$.preferredSize(context);
    await params.rootWidget.$.mount(rootElement, rootLayout);
}
function elementWidget(type, initialize) {
    let context = null;
    let destroyFn = null;
    let initializeResult = null;
    let stashedElement = null;
    async function preferredSize(parentContext) {
        context = parentContext;
        function getChildPreferredSize(child) {
            return child.$.preferredSize(parentContext);
        }
        initializeResult = await initialize({
            context,
            getChildPreferredSize
        });
        return initializeResult.preferredSize;
    }
    async function mount(parentElement, layout) {
        if (!context || !initializeResult) throw new Error('something went wacky');
        const element = document.createElement(type);
        stashedElement = element;
        async function mountChild(child, layout) {
            if (!context) throw new Error('something went wacky');
            await child.$.mount(element, layout);
        }
        destroyFn = await initializeResult.mount({
            element,
            layout,
            mountChild
        });
        parentElement.appendChild(element);
    }
    async function destroy() {
        if (destroyFn) await destroyFn();
        if (!stashedElement) throw new Error('something wrong happened');
        stashedElement.remove();
        context = null;
        destroyFn = null;
        initializeResult = null;
        stashedElement = null;
    }
    return {
        $: {
            preferredSize,
            mount,
            destroy
        }
    };
}
function Center(params) {
    return elementWidget('div', ({ getChildPreferredSize  })=>({
            async mount ({ layout , mountChild , element  }) {
                setPosition(element, layout);
                const childPreferredSize = await getChildPreferredSize(params.child);
                const childWidth = childPreferredSize.width ?? layout.width;
                const childHeight = childPreferredSize.height ?? layout.height;
                await mountChild(params.child, {
                    width: childWidth,
                    height: childHeight,
                    x: (layout.width - childWidth) / 2,
                    y: (layout.height - childHeight) / 2
                });
            },
            preferredSize: {
                width: null,
                height: null
            }
        })
    );
}
function Text(text, params = {
}) {
    return elementWidget('div', ()=>{
        const font = params.font ?? 'Arial, Helvetica, sans-serif';
        const size = params.size ?? 14;
        const weight = params.bold ? 700 : params.fontWeight ?? 500;
        const italic = params.italic ?? false;
        const height = params.lineHeight ?? 16;
        const width = getTextWidth(text, {
            font,
            size,
            weight,
            italic
        });
        return {
            mount ({ element , layout  }) {
                setPosition(element, layout);
                element.style.fontSize = `${size}px`;
                element.style.fontFamily = font;
                if (params.color) element.style.color = params.color;
                if (params.textShadow) element.style.textShadow = `${params.textShadow.x}px ${params.textShadow.y}px ${params.textShadow.blur}px ${params.textShadow.color}`;
                if (italic) element.style.textDecoration = 'italic';
                element.style.fontWeight = `${weight}`;
                element.style.lineHeight = `${height}px`;
                element.style.whiteSpace = 'nowrap';
                if (params.clipOverflow) element.style.textOverflow = 'ellipsis';
                element.textContent = text.replace('\t', repeat('&nbsp;', params.tabSpaces ?? 4));
            },
            preferredSize: {
                width,
                height
            }
        };
    });
}
let stashedCanvas = null;
function getTextWidth(text, options) {
    const styleString = `${options.italic ? 'italic' : options.weight} ${options.size}px ${options.font}`;
    if (!stashedCanvas) stashedCanvas = document.createElement('canvas');
    const context = stashedCanvas.getContext('2d');
    context.font = styleString;
    const metrics = context.measureText(text);
    return metrics.width;
}
function widget() {
    let thisContext = null;
    let buildFn = null;
    let activeChildWidget = null;
    let stashedParentElement = null;
    let stashedLayout = null;
    let beforeDestroyFn = null;
    let afterDestroyFn = null;
    let beforeMountFn = null;
    let afterMountFn = null;
    async function preferredSize(parentContext) {
        if (!buildFn) throw new Error('"build" was not called before widget was mounted');
        thisContext = makeContext(parentContext);
        activeChildWidget = await buildFn(thisContext);
        return activeChildWidget.$.preferredSize(thisContext);
    }
    async function mount(parentElement, layout) {
        if (!activeChildWidget) throw new Error('"mount" was called before "preferredSize"');
        stashedParentElement = parentElement;
        stashedLayout = layout;
        if (beforeMountFn) await beforeMountFn();
        await activeChildWidget.$.mount(parentElement, layout);
        if (afterMountFn) await afterMountFn();
    }
    async function destroy() {
        if (!activeChildWidget) throw new Error('widget has already been destroyed');
        if (beforeDestroyFn) await beforeDestroyFn();
        await activeChildWidget.$.destroy();
        if (afterDestroyFn) await afterDestroyFn();
        thisContext = null;
        buildFn = null;
        activeChildWidget = null;
        beforeDestroyFn = null;
        afterDestroyFn = null;
        beforeMountFn = null;
        afterDestroyFn = null;
    }
    function build(fn) {
        if (buildFn) throw new Error('"build" can only be called once in each widget');
        buildFn = fn;
    }
    async function setState(fn) {
        if (!activeChildWidget || !thisContext || !buildFn || !stashedParentElement || !stashedLayout) throw new Error('"setState" cannot be called before widget is mounted or after it is destroyed');
        await fn();
        await activeChildWidget.$.destroy();
        activeChildWidget = await buildFn(thisContext);
        await activeChildWidget.$.preferredSize(thisContext);
        await activeChildWidget.$.mount(stashedParentElement, stashedLayout);
    }
    function beforeDestroy(fn) {
        if (beforeDestroyFn) throw new Error('"beforeDestroy" cannot be called more than once inside a widget');
        beforeDestroyFn = fn;
    }
    function afterDestroy(fn) {
        if (afterDestroyFn) throw new Error('"afterDestroy" cannot be called more than once inside a widget');
        afterDestroyFn = fn;
    }
    function beforeMount(fn) {
        if (beforeMountFn) throw new Error('"beforeMount" cannot be called more than once inside a widget');
        beforeMountFn = fn;
    }
    function afterMount(fn) {
        if (afterMountFn) throw new Error('"afterMount" cannot be called more than once inside a widget');
        afterMountFn = fn;
    }
    return {
        build,
        setState,
        beforeDestroy,
        afterDestroy,
        beforeMount,
        afterMount,
        $: {
            preferredSize,
            mount,
            destroy
        }
    };
}
function App() {
    const { $ , build  } = widget();
    build(()=>Center({
            child: Text('Hello, World!')
        })
    );
    return {
        $
    };
}
createLubberApplication({
    rootWidget: App()
});
