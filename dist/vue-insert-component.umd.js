import { defineComponent, h, getCurrentInstance, createApp } from 'vue';

var Wrap = defineComponent({
    name: 'InsertWrap',
    props: {
        rootComponent: {
            type: Object
        }
    },
    data() {
        return {
            list: []
        };
    },
    render() {
        return [
            this.rootComponent ? h(this.rootComponent) : h('div'),
            ...this.list.map(item => h(item))
        ];
    },
    beforeCreate() {
        const instance = getCurrentInstance();
        if (instance) {
            instance.appContext.config.globalProperties.$insert = (component) => this.list.push(component);
        }
    }
});

function Plugin(app) {
}
var index = (AppVue) => {
    const rootApp = createApp(Wrap, { rootComponent: AppVue });
    return {
        rootApp,
        modal: Plugin
    };
};

export default index;
