import * as $ from 'jquery'
import Post from '@/post'
import '@styles/styles.css'
import '@styles/styles.sass'
import '@/babel'




const post = new Post('Webpack post title')



async function start() {
        return await Promise.resolve('async is working!')
}

class Util {
        static id = Date.now()
}
start().then(console.log)
console.log(Util.id)
console.log($('div'))
console.log(post)

