/*
 * jQuery v1.9.1 included
 */

$(document).ready(function () {

	// social share popups
	$(".share a").click(function (e) {
		e.preventDefault();
		window.open(this.href, "", "height = 500, width = 500");
	});

	// show form controls when the textarea receives focus or backbutton is used and value exists
	var $commentContainerTextarea = $(".comment-container textarea"),
		$commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

	$commentContainerTextarea.one("focus", function () {
		$commentContainerFormControls.show();
	});

	if ($commentContainerTextarea.val() !== "") {
		$commentContainerFormControls.show();
	}

	// Expand Request comment form when Add to conversation is clicked
	var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
		$requestCommentFields = $(".request-container .comment-container .comment-fields"),
		$requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

	$showRequestCommentContainerTrigger.on("click", function () {
		$showRequestCommentContainerTrigger.hide();
		$requestCommentFields.show();
		$requestCommentSubmit.show();
		$commentContainerTextarea.focus();
	});

	// Mark as solved button
	var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
		$requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
		$requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

	$requestMarkAsSolvedButton.on("click", function () {
		$requestMarkAsSolvedCheckbox.attr("checked", true);
		$requestCommentSubmitButton.prop("disabled", true);
		$(this).attr("data-disabled", true).closest("form").submit();
	});

	// Change Mark as solved text according to whether comment is filled
	var $requestCommentTextarea = $(".request-container .comment-container textarea");

	$requestCommentTextarea.on("input", function () {
		if ($requestCommentTextarea.val() !== "") {
			$requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-and-submit-translation"));
			$requestCommentSubmitButton.prop("disabled", false);
		} else {
			$requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-translation"));
			$requestCommentSubmitButton.prop("disabled", true);
		}
	});

	// Disable submit button if textarea is empty
	if ($requestCommentTextarea.val() === "") {
		$requestCommentSubmitButton.prop("disabled", true);
	}

	// Submit requests filter form in the request list page
	$("#request-status-select, #request-organization-select")
		.on("change", function () {
			search();
		});

	// Submit requests filter form in the request list page
	$("#quick-search").on("keypress", function (e) {
		if (e.which === 13) {
			search();
		}
	});

	function search() {
		window.location.search = $.param({
			query: $("#quick-search").val(),
			status: $("#request-status-select").val(),
			organization_id: $("#request-organization-select").val()
		});
	}

	function toggleNavigation(toggleElement) {
		var menu = document.getElementById("user-nav");
		var isExpanded = menu.getAttribute("aria-expanded") === "true";
		menu.setAttribute("aria-expanded", !isExpanded);
		toggleElement.setAttribute("aria-expanded", !isExpanded);
	}

	$(".header .icon-menu").on("click", function (e) {
		e.stopPropagation();
		toggleNavigation(this);
	});

	$(".header .icon-menu").on("keyup", function (e) {
		if (e.keyCode === 13) { // Enter key
			e.stopPropagation();
			toggleNavigation(this);
		}
	});

	$("#user-nav").on("keyup", function (e) {
		if (e.keyCode === 27) { // Escape key
			e.stopPropagation();
			this.setAttribute("aria-expanded", false);
			$(".header .icon-menu").attr("aria-expanded", false);
		}
	});

	if ($("#user-nav").children().length === 0) {
		$(".header .icon-menu").hide();
	}

	// Submit organization form in the request page
	$("#request-organization select").on("change", function () {
		this.form.submit();
	});

	// Toggles expanded aria to collapsible elements
	$(".collapsible-nav, .collapsible-sidebar").on("click", function (e) {
		e.stopPropagation();
		var isExpanded = this.getAttribute("aria-expanded") === "true";
		this.setAttribute("aria-expanded", !isExpanded);
	});
});

// Data handling

function getLatestNewsArticle(callback) {
	var data = null;

	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			var homeArticle = (JSON.parse(xhr.response)).articles[0];
			var content = {
				text: homeArticle.body,
				title: homeArticle.title,
				createdAt: homeArticle.created_at,
				link: homeArticle.html_url,
			};

			console.log(homeArticle);

			callback(content)
		}
	}

	xhr.open("GET", "https://testdominic.zendesk.com/api/v2/help_center/en-gb/articles.json?label_names=homepage");
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Authorization", "Basic bWVAcmFkb3ZhbnN1cmxhay5jb206bm92ZWRvY2FzbmVoZXNsbw==");
	xhr.setRequestHeader("Cache-Control", "no-cache");
	xhr.setRequestHeader("Postman-Token", "2a07d37b-c6a3-4f5d-a0fa-4b0fc0506818");

	xhr.send(data);

}

function dateDifferenceDays(date1, date2) {
	return Math.round(Math.abs(date1 - date2) / 8.64e7)
}

function injectNewsData(news, content) {
	// Saving the elements into variables
	var articvarext = news.getElementsByClassName('news__article__text')[0];
	var articvaritle = news.getElementsByClassName('news__article__title')[0].firstChild;
	var articleComments = news.getElementsByClassName('news__article__comment-text')[0];
	var articleDate = news.getElementsByClassName('news__article__date')[0];

	var dateToday = new Date();
	var dateArticleCreated = new Date(content.createdAt);

	function dateString(dateToday, dateArticleCreated) {
		var baseString = 'Created ';
		var numberOfDays = dateDifferenceDays(dateToday, dateArticleCreated)
		switch(numberOfDays) {
			case 0:
					return baseString + 'today'
			case 1:
				return baseString + '1 day ago'
			default:
				return baseString + numberOfDays + ' days ago'
		}
	}

	articvarext.innerHTML = content.text;
	articvaritle.href = content.link;
	articvaritle.innerText = content.title;
	articleComments.innerText = 2;
	articleDate.innerText = dateString(dateToday, dateArticleCreated);

}

document.addEventListener("DOMContentLoaded", function () {
	var newsSection = document.querySelector('[data-news]');
	if (newsSection === null) return;
	getLatestNewsArticle(function (articleContent) {
		injectNewsData(newsSection, articleContent)
	});

});


// Output the variables in the homepage