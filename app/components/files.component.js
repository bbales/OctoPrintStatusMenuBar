Vue.component('files', {
    template: `
    <div class="files" v-if="$root.view == 'files'">
        <div class="box no-right-border" style="width:100%;">Files</div>
        <div class="box scroller no-right-border">
            <div class="box no-right-border light-bg" style="width:100%;" v-for="f in $root.files">{{f.name}}</div>
        </div>
    </div>
    `,
    mounted() {
        Api.getFiles(this.$root).then(f => {
            console.log('got files')
        })
    }
})
