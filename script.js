let postUl = document.getElementById('postList')

let showModalBtns
let deletePostBtns
let editPostBtns

let editPostBtn = document.getElementById('editPostBtn')
let deletePostBtn = document.getElementById('deletePostBtn')
let savePostBtn = document.getElementById('savePostBtn')
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

let deletePost = async (e) => {
    let id = e.target.getAttribute('post-id')
    
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/' + id, {
                        method: 'DELETE',
                    })
        if (response.ok){ 
            e.target.parentElement.remove()
            alert ('Post deleted!')
        } else { 
            alert('Something went wrong!')
        }
    } catch (error) {
        console.error(error)
    }
}

let deletePostFromModal = async (e) => {
    let id = e.target.getAttribute('post-id')
    
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/' + id, {
                        method: 'DELETE',
                    })
        if (response.ok){ 
            
            alert ('Post deleted!')
        } else { 
            alert('Something went wrong!')
        }
    } catch (error) {
        console.error(error)
    }
}

let savePost = async (e) => {
    let id = e.target.getAttribute('post-id')
    let userId = e.target.getAttribute('user-id')

    try {
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/' + id, {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                title: modalTitle.value,
                body: modalBody.value,
                userId: userId,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
})
  const json = await response.json()
  console.log(json)
  
    } catch (error) {
        console.error(error)
    }
}

let makePostEditable = () => {
    modalTitle.disabled = false
    modalBody.disabled = false
    savePostBtn.disabled = false
}

let makePostUneditable = () => {
    modalTitle.disabled = true
    modalBody.disabled = true
    savePostBtn.disabled = true
}

let showPostsList = async (x = 5) => {
    let postsArr = await getPostsData(x)
    
    let newDocumentFragment = document.createDocumentFragment()
    postsArr.forEach( eachPost => {
        
        let newLi = document.createElement('li')
        newLi.classList.add('list-group-item')
        newLi.innerHTML = `
            ${eachPost.title}
            <button type="button" class="btn btn-primary showModalBtn" data-bs-toggle="modal" data-bs-target="#exampleModal" post-id="${eachPost.id}" user-id="${eachPost.userId}">
            Open Post
            </button>
            <button type="button" class="btn btn-secondary editPostBtn" data-bs-toggle="modal" data-bs-target="#exampleModal" post-id="${eachPost.id}" user-id="${eachPost.userId}">
            Edit Post
            </button>
            <button type="button" class="btn btn-danger deletePostBtn" post-id="${eachPost.id}" user-id="${eachPost.userId}">
            Delete Post
            </button>
        `
        
        newDocumentFragment.appendChild(newLi)
    })
    
    postUl.appendChild(newDocumentFragment)

    showModalBtns = document.querySelectorAll('.showModalBtn')    
    showModalBtns.forEach( eachBtn => eachBtn.addEventListener('click', (e) => {
        makePostUneditable()
        updateModal(e)
        }
    ))

    deletePostBtns = document.querySelectorAll('.deletePostBtn')    
    deletePostBtns.forEach( eachBtn => eachBtn.addEventListener('click', deletePost ))

    editPostBtns = document.querySelectorAll('.editPostBtn')    
    editPostBtns.forEach( eachBtn => eachBtn.addEventListener('click', (e) => {
        makePostEditable()
        updateModal(e)
        }
    ))
    
}
let cleanCommentsList = () => {
    let commentsUl = document.getElementById('commentsList')
    commentsUl.innerHTML = ''
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

let cleanModal = () => {
    modalTitle.value = 'Loading'
    modalBody.value = ''
    modalEmailUsername.value = ''
    cleanCommentsList()
}

let updateModal = async (e) => {
    cleanModal()
    let postId = e.target.getAttribute('post-id')
    let userId = e.target.getAttribute('user-id')
    let postInfo = await getPostData(postId)
    let userInfo = await getUserData(userId)
    modalTitle.value = postInfo.title
    modalBody.value = postInfo.body
    modalEmailUsername.value = `Username: ${userInfo.username} - Emai: ${userInfo.email}`
    savePostBtn.setAttribute('post-id', postId)
    savePostBtn.setAttribute('user-id', userId)
    deletePostBtn.setAttribute('post-id', postId)
    btnShowComments.setAttribute('post-id', postId)
    btnShowComments.addEventListener('click', btnShowCommentsClick)
}

let btnShowCommentsClick = async (e) => {
    let postId = e.target.getAttribute('post-id')
    let commentsData = await getCommentsData( postId )
    
    showCommentsList(commentsData)
}

showPostsList()

document.addEventListener('DOMContentLoaded', () => {
    savePostBtn.addEventListener('click', savePost )
    deletePostBtn.addEventListener('click', deletePostFromModal )
    editPostBtn.addEventListener('click', makePostEditable)
    
})



