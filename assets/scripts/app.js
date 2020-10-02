const postsList = document.querySelector('.posts');
const postTemplate = document.getElementById('post-template');
const form = document.querySelector('#new-post form');
const renderedPosts = document.querySelector('#available-posts');

const fetchPostsBtn = renderedPosts.querySelector('button');

fetchPostsBtn.addEventListener('click', fetchPosts);

form.addEventListener('submit', event => {
    event.preventDefault();
    const enteredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;;
    createPost(enteredTitle, enteredContent);
} )

const sendHttpRequest = function(method, url, data) {
    // const promise = new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open(method, url);
        
    //     xhr.responseType = 'json';
    
    //     xhr.onload = function() {
    //         if (xhr.status >= 200 && xhr.status < 300) {
    //             resolve(xhr.response);
    //         } else {
    //             reject(new Error('Something went wrong on the server'));
    //         }
    //     }

    //     xhr.onerror = function() {
    //         reject(new Error('Failed to send request'));
    //     }
        
    //     xhr.send(JSON.stringify(data));
    // });
    // return promise;

    return fetch(url, {
        method: method,
        body: data,
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    })
    .then(response => {
        if(response.status >= 200 && response.status < 300) {
            return response.json()
        } else {
            return response.json().then( errData => {
                console.log(errData);
                throw new Error('Something went wrong on the server.')
            })
        }
    })
    .catch(error => {
        console.log(error);
        throw new Error('Failed to send request')
    });
}

async function fetchPosts() {
    try {
        while(postsList.firstChild) {
            postsList.removeChild(postsList.firstChild);
        };
    
        const respPostList = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const list = respPostList.data
                   
        for(const post of list) {
           const postItem = document.importNode(postTemplate.content, true);
           postItem.querySelector('h2').textContent = post.title.toUpperCase();
           postItem.querySelector('p').textContent = post.body;
           postItem.querySelector('li').id = post.id;
           postsList.appendChild(postItem);
       }
    } catch (error) {
        console.log(error.response);
        alert(error.message);
    }
}

async function createPost(title, content) {
    const id = Math.random();
    const post = {
        title: title,
        body: content,
        userId: id
    };

    const formUserData  = new FormData(form);
    formUserData.append('userId', id);

    const createPostResponse = await axios.post('https://jsonplaceholder.typicode.com/posts', formUserData);
}

postsList.addEventListener('click', event => {
    if(event.target.tagName === 'BUTTON') {
        const postId = event.target.closest('li').id;
        console.log(postId);
        const deletePostResponse = sendHttpRequest('delete',`https://jsonplaceholder.typicode.com/posts/${postId}`);
        console.log(deletePostResponse);

        // const post = postsList.
        // postsList.removeChild();

    }
})


