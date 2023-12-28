let postUl = document.getElementById('postList')

let showModalBtns

let modalTitle = document.getElementById('exampleModalLabel')
let modalBody = document.getElementById('modalPostBody')
let modalEmailUsername = document.getElementById('modalEmailUsername')
let btnShowComments = document.getElementById('btnShowComments')

let getPostsData = async (x = 5) => {
    let postsArr = [];

    try {
        for (let i = 1; i <= x; i++) {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts/' + i);
            const json = await response.json();
            postsArr.push(json);
        }
    } catch (error) {
        console.log(error);
    }

    return postsArr;
};

let getPostData = async (id) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/' + id);
        const json = await response.json();
        return json
    } catch (error) {
        console.log(error)
    }
}

let getUserData = async (id) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/' + id);
        const json = await response.json();
        return json
    } catch (error) {
        console.log(error)
    }
}

let getCommentsData = async (id) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/' + id + '/comments');
        const json = await response.json();
        return json
    } catch (error) {
        console.log(error)
    }
}

let showPostsList = async () => {
    let postsArr = await getPostsData()
    
    let newDocumentFragment = document.createDocumentFragment()
    postsArr.forEach( eachPost => {
        
        let newLi = document.createElement('li')
        newLi.classList.add('list-group-item')
        newLi.innerHTML = `
            ${eachPost.title}
            <button type="button" class="btn btn-primary showModalBtn" data-bs-toggle="modal" data-bs-target="#exampleModal" post-id="${eachPost.id}" user-id="${eachPost.userId}">
            Open Post
            </button>
        `
        
        newDocumentFragment.appendChild(newLi)
    })
    
    postUl.appendChild(newDocumentFragment)
    showModalBtns = document.querySelectorAll('.showModalBtn')    
    showModalBtns.forEach( eachBtn => eachBtn.addEventListener('click', updateModal ))
    
}

let showCommentsList = (commentsData) => {
    let commentsUl = document.getElementById('commentsList')
    commentsUl.innerHTML = ''
    let newDocumentFragment = document.createDocumentFragment()

    commentsData.forEach( comment => {
        let newLi = document.createElement('li')
        newLi.classList.add('list-group-item')
        newLi.innerHTML = `
            <h4>${comment.email}</h4>
            <h5>${comment.name}</h5>
            <p>${comment.body}</p>
        `
        
        newDocumentFragment.appendChild(newLi)
    })
    commentsUl.appendChild(newDocumentFragment)

}

let updateModal = async (e) => {
    let postId = e.target.getAttribute('post-id')
    let userId = e.target.getAttribute('user-id')
    let postInfo = await getPostData(postId)
    let userInfo = await getUserData(userId)
    modalTitle.textContent = postInfo.title
    modalBody.textContent = postInfo.body
    modalEmailUsername.textContent = `Username: ${userInfo.username} - Emai: ${userInfo.email}`
    btnShowComments.setAttribute('post-id', postId)
    btnShowComments.addEventListener('click', btnShowCommentsClick)
}

let btnShowCommentsClick = async (e) => {
    let postId = e.target.getAttribute('post-id')
    let commentsData = await getCommentsData( postId )
    
    showCommentsList(commentsData)
}

showPostsList()


// document.addEventListener('DOMContentLoaded', () => {
   
    
// })


