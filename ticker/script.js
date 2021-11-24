function all() {
var headlines = $('#headlines');
var links = $('a');
var step = 3;
var animId;
var firstLinkWidth = links.eq(0).outerWidth(); // the width of the first link inside links collection
var headlinesOffset = headlines.offset().left; // the headlines container left offset



// stop the ticker move when the mouse hover 
headlines.on('mouseenter', function() {
    cancelAnimationFrame(animId);
})

// resume the ticker move once the mouse leaves
headlines.on('mouseleave', function() {
    headlinesMove();
})

function headlinesMove() {
    headlinesOffset -= step;
    
    // once the first link goes away to the right >> move it to the tail of links collection & adjust this move caused position distortion 
    if(headlinesOffset < -firstLinkWidth) {
        // first shift the ticker bar to the right using the firstLinkWidth 
        headlinesOffset += firstLinkWidth;
        // then move this first link to the ticker tail
        links.eq(0).appendTo(headlines);
        links = $('a');
        // then update the firstLinkWidth value with the next link width which is now moved to ticker head
        firstLinkWidth = links.eq(0).outerWidth();

        
    }
    
    // console.log(headlinesOffset);
    headlines.css({left: headlinesOffset + 'px',});
    // console.log(headlines.css("left"));
    // requestAnimationFrame must take a callback input to keep doing the movement
    animId = window.requestAnimationFrame(headlinesMove);

}

headlinesMove();
}

$.ajax({
    url: "links.json",
    success: function(response) {
        console.log("hellooo2");
        // add links to html
        var headlines = $('#headlines');
        for(var i=0; i<response.length; i++) {
            var htmlAdded = "<a href=" + response[i].url + ">" + response[i].text + "</a>";
            headlines.append(htmlAdded);
        }
        // then start animation
        all();

    }
});