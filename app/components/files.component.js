Vue.component('files', {
    props: ['job', 'progress', 'status', 'files'],
    template: `
    <div class="files">
        <div class="box no-right-border" style="width:100%;">Files</div>
        <div class="box scroller no-right-border">
            <div class="box no-right-border light-bg" style="width:100%;" v-for="f in files">{{f.name}}</div>
        </div>
    </div>
    `
})
