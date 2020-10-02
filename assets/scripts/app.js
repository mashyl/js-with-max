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
    //             reject(new Error('Something went wrong'));
    //         }
    //     }

    //     xhr.onerror = function() {
    //         reject(new Error('Failed to send request'));
    //     }
        
    //     xhr.send(JSON.stringify(data));
    return fetch(url, {
        method: method,
        body: JSON.stringify(data)
    }).then(response => 
            response.json()
        )
    // });
    // return promise;

    
}

async function fetchPosts() {
    // try {
        while(postsList.firstChild) {
            postsList.removeChild(postsList.firstChild);
        };
    
        const respPostList = await sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts');
                   
        for(const post of respPostList) {
           const postItem = document.importNode(postTemplate.content, true);
           postItem.querySelector('h2').textContent = post.title.toUpperCase();
           postItem.querySelector('p').textContent = post.body;
           postItem.querySelector('li').id = post.id;
           postsList.appendChild(postItem);
       }
    // } catch (error) {
    //     alert(error.message);
    // }
}

async function createPost(title, content) {
    const id = Math.random();
    const post = {
        title: title,
        body: content,
        userId: id
    };
    sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
}

postsList.addEventListener('click', event => {
    if(event.target.tagName === 'BUTTON') {
        const postId = event.target.closest('li').id;
        console.log(postId)
        sendHttpRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${postId}`);
        // const post = postsList.
        // postsList.removeChild();

    }
})
