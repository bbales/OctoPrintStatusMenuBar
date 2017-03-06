Vue.component('tabs', {
    props: ['tabs'],
    template: `
    <div class="tabs">
        <div class="tab" v-for="tab in tabs" @click="$root.view = tab.name">
            <i :class="'fa '+tab.icon"></i>
            {{tab.label}}
        </div>
    </div>
    `
})
