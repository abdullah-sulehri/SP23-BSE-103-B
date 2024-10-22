$(document).ready(function () {
    $('#postForm').on('submit', function (event) {
        
        event.preventDefault();
        $('#userStories').empty();
        const title = $('#title').val();
        const body = $('#body').val();
        const userId = $('#userId').val();

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                title: title,
                body: body,
                userId: userId,
            }),
            success: function () {
                $('#title').val('');
                $('#body').val('');
                $('#userId').val('');
                $('#responseMessage').text('Post created successfully!');
            },
            error: function () {
                $('#responseMessage').text('Error creating post.');
            }
        });
       
    });

    $('#getUsersBtn').on('click', function () {
        
       
        
        const postId = $('#postId').val();
        console.log("Fetching post with ID:", postId);
        $('#responseMessage').empty();
        let url 
        if(postId){
            url=`https://jsonplaceholder.typicode.com/posts/${postId}`
        } 
        else{
            url='https://jsonplaceholder.typicode.com/posts';
        }

        $.ajax({
            url: url,
            method: 'GET',
            success: function (data) {
                const userStoriesDiv = $('#userStories');
                userStoriesDiv.empty();

                if (Array.isArray(data)) {
                    $.each(data, function (index, story) {
                        userStoriesDiv.append(`
                            <div class="story" data-id="${story.id}">
                                <h3>User ID: ${story.userId} Post ID: ${story.id}</h3>
                                <h3>Title: ${story.title}</h3>
                                <p>Body: ${story.body}</p>
                                <button class="edit">Edit</button>
                                <button class="delete">Delete Post</button>
                            </div>
                        `);
                    });
                } else {
                    userStoriesDiv.append(`
                        <div class="story" data-id="${data.id}">
                            <h3>User ID: ${data.userId} Post ID: ${data.id}</h3>
                            <h3>Title: ${data.title}</h3>
                            <p>Body: ${data.body}</p>
                            <button class="edit">Edit</button>
                            <button class="delete">Delete Post</button>
                        </div>
                    `);
                }
            },
            error: function () {
                console.error('Error fetching post(s)');
                $('#userStories').append('<p>Error fetching post(s).</p>');
            }
        });
    });

    
    $('#userStories').on('click', '.delete', function () {
        const postId = $(this).closest('.story').data('id'); 
        $.ajax({
            url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
            method: 'DELETE',
            success: function () {
                $('#responseMessage').text('Post deleted successfully');
                $(this).closest('.story').remove();
            }.bind(this), 
            error: function () {
                $('#responseMessage').text("Error deleting post");
            },
        });
    });

   
    $('#userStories').on('click', '.edit', function () {
        const title = $(this).siblings('h3').eq(1).text(); 
        const body = $(this).siblings('p').text(); 
        const userId = $(this).siblings('h3').val();

        
        $('#userId').val(userId); 
        $('#title').val(title); 
        $('#body').val(body); 

       
        $('#postForm').off('submit').on('submit', function (event) {
            event.preventDefault();

            $.ajax({
                url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
                method: 'PUT', 
                contentType: 'application/json',
                data: JSON.stringify({
                    title: $('#title').val(),
                    body: $('#body').val(),
                    userId: $('#userId').val(), 
                }),
                success: function () {
                    $('#responseMessage').text('Post updated successfully!');
                    $('#getUsersBtn').click(); 
                },
                error: function () {
                    $('#responseMessage').text('Error updating post.');
                }
            });
        });
    });
});
