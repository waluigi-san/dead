var list = ["afraid","multiply","divide","less-afraid","goout","laughter","compacts","smile","ownfaces","ownvoices","nomirrors","noechoes","otherfaces","othercorners","allmirrors","allechoes","naked","clothe","death","undress"];
var wrap = $('body');

var span = $('.wrapper span');

span.addClass('future');

function fn(prev, next) {
	if (prev) {
		wrap.removeClass(prev);
		$('.'+prev).addClass('past');
	}
	wrap.addClass(next);
	$('.'+next).removeClass('future');
	setTimeout(function() {
		fn(next, list.shift());
	}, 3500);
}

$('#start').click(function(){
	wrap.addClass('started');
	fn(null,list.shift());
});