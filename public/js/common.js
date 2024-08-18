// Contain shared code each page can use, can reuse behavior for certain code blocks

$("#postTextarea").keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();
    
    var submitButton = $("#submitPostButton");
    if (submitButton.length == 0) return alert("No submit button found");
    if (value == "") {
        // set the button property of disabled to true
        submitButton.prop("disabled", true);
        return;
    }
    // set the button property of disabled to false
    submitButton.prop("disabled", false);
})

$("#submitPostButton").click((event) => {
    var button = $(event.target);
    var textbox = $("#postTextarea");

    var data = {
        content: textbox.val()
    }
    // After handling post request, set the button to disabled state and clear the input box
    $.post("/api/posts", data, postData => {
        var html = createPostHTML(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
})

$(document).on("click", ".likeButton", event => {
    var button = $(event.target);
    var post_id = getPostIdFromElement(button);

    // Make a PUT request to the server to change the data
    $.ajax({
        url: `/api/posts/${post_id}/like`,
        type: 'PUT',
        success: postData => {
            console.log(postData.likes.length);

            button.find("span").text(postData.likes.length || "");

            if (postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active");
            } else {
                button.removeClass("active");
            }
        }
    })
})

$(document).on("click", ".retweetButton", event => {
    var button = $(event.target);
    var post_id = getPostIdFromElement(button);

    // Make a PUT request to the server to change the data
    $.ajax({
        url: `/api/posts/${post_id}/retweet`,
        type: 'POST',
        success: postData => {
            console.log(postData.retweetUsers.length);
            button.find("span").text(postData.retweetUsers.length || "");

            if (postData.retweetUsers.includes(userLoggedIn._id)) {
                button.addClass("active");
            } else {
                button.removeClass("active");
            }
        }
    })
})

function getPostIdFromElement(element) {
    // Get the postId for the nearest class with the classname 'post'
    var isRoot = element.hasClass("post");
    var rootElement = isRoot ? element : element.closest('.post');
    var postId = rootElement.data().id;

    if (postId === undefined) return;

    return postId;
}
function createPostHTML(postData) {

    if(postData == null) return alert("post object is null");

    var isRetweet = postData.retweetData !== undefined;
    var retweetedBy = isRetweet ? postData.postedBy.userName : null;
    postData = isRetweet ? postData.retweetData : postData;

    console.log(isRetweet);
    
    var postedBy = postData.postedBy;

    if(postedBy._id === undefined) {
        return console.log("User object not populated");
    }

    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timeStamp = timeDifference(new Date(), new Date(postData.createdAt));
    
    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active": "";
    var retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active": "";
    
    var retweetText = "";
    if (isRetweet) {
        retweetText = `<span>
                            <i class='fas fa-retweet'></i>
                            Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}
                        </span>`
    }

    return `<div class='post' data-id='${postData._id}'>
                <div class='postActionContainer'>
                    ${retweetText}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.userName}' class='displayName'>${displayName}</a>
                            <span class='username'>@${postedBy.userName}</span>
                            <span class='date'>${timeStamp}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='far fa-comment'></i> 
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class='retweetButton ${retweetButtonActiveClass}'>
                                    <i class='fas fa-retweet'></i> 
                                    <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class='far fa-heart'></i> 
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed/1000 < 30) return 'Just now';
        return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}