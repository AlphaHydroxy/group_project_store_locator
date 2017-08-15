var Comments = function(){
    var comments = new Comments();
    comments.all(function(result){
        this,render(result);
    }.bind(this));
    this.createForm();
}

Comments.prototype = {

    createForm: function(){
        var div = document.createElement('div');
        var form = document.createElement('form');
        var body = document.querySelector('body');

        var commentNameInput = document.createElement('input');
        commentNameInput.setAttribute("name", "name");
        form.appendChild(commentNameInput);

        var commentTitleInput = document.createElement('input');
        commentTitleInput.setAttribute("name", "title");
        form.appendChild(commentTitleInput);

        var commentCommentInput = document.createElement('inupt');
        commentCommentInput.setAttribute("name", "comment");
        form.appendChild(commentCommentInput);

        var button = document.createElement('button');
        button.type = 'submit';
        button.innerText = "Submit Comment";
        form.appendChild(button);

        form.onsubmit = function(e){
            e.preventDefault();
            var newComment = {
                name: e.target.name.value,
                title: e.target.title.value,
                comment: e.target.title.value,
            }
            var comments = new Comment();
            comments.addEventListener(newComment, function(data){
                // console.log(data);
            })
        }
        div.appendChild(form);
        body.insertBefore(div, body.firstChild);
    }
}