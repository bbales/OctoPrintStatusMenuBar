Vue.component('tabs', {
    template: `
    <div class="tabs">
        <div :class="'tab'+ ($root.view == tab.name ? ' active' : '')" v-for="tab in $root.tabs" @click="$root.view = tab.name" :title="tab.name">
            <i :class="'fa '+tab.icon"></i>
            {{tab.label}}
        </div>
    </div>
    `,
})
