$(document).ready(() => {
    $.get("/api/posts", results => {
        outputPost(results, $(".postsContainer"))
    })
})

function outputPost(results, container) {
    container.html("");

    if (!Array.isArray(results)) {
        results = [results];
    }

    // for each posts
    results.forEach(result => {
        var html = createPostHTML(result);
        container.append(html);
    });

    if (results.length == 0) {
        container.append('<span class="noResult">Nothing to show</span>');
    }
}