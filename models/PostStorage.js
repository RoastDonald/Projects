module.exports = class PostStorage{
    constructor(oldStorage){
        this.posts = oldStorage.posts || {};
        this.qty = oldStorage.qty || 0;
        this.totalPosts = oldStorage.totalPosts || 0;
    }

    add(post,id){

        let storedItem = this.posts[id];
        if(!storedItem){
            storedItem = this.posts[id] = {subject:post[0].subject,text:post[0].text,qty:0};
        }
         storedItem.qty++;
         this.totalPosts++;
    }

};