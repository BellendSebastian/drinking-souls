(function() {

	var rules = {};
		rules.pvp = ["Kill an invading player, everyone else takes a drink.", "Invade a game and kill the enemy player, everyone else takes a drink. Pass the controller", "An invading player kills you, take a drink, pass the controller.", "An invading player kills you while you have teammates (NPC or otherwise), take three drinks. Pass the controller. Loser.", "Invade a game and get defeated, take two drinks. Pass the controller.", "Equip the Ring of Fog when invading, or being invaded, take a drink."];
		rules.solo = ["You die, you drink.", "Failure to reclaim souls, take two drinks.", "Environmental death, (like rolling off a cliff) two drinks.", "Kill a boss, take a victory drink!", "Light or use a bonfire, take a drink.", "Using the last estus flask, take a drink.", "Using a humanity, take a drink.", "If you are human, all drinks are multiplied x2", "If you summon help, you must add another drink to all of your penalties, while that player is active (NPC or not)"];
		rules.newold = ["For every 3 questions a new player asks about Dark Souls, they must take a drink. (regardless if it's their turn or not)", "If any advanced player is an open book (assists players with knowledge about Dark Souls), they must take a drink, regardless if it's their turn or not.", "If a boss fight has been reached, and there is a player in the group who has never done that fight, then they must assume to controller.", "If a new player to Dark Souls beats a boss their first try (without help), everyone must finish their drink.", "If an advanced player fails against a boss, drink twice. Pass the controller."];
		rules.advanced = ["Pretend to be an egg, you must sing \"I'm an egg, I'm an egg. I'm an egg I'm an egg I'm an egg.\"", "Advanced players must try new things, and not play to their strengths, but rather weaknesses.", "Advanced players must take their penalty drinks while playing. Not accumulate them for the end of their turn.", "Advanced players that skip an NPC quest line, take a drink.", "Advanced players that drop below 50% health outside of a boss battle must take a drink."];

	var saveForm = function(data) {
		localStorage.setItem("drinking-souls", data);
	};

	var getFormData = function() {
		var data = localStorage.getItem("drinking-souls") || undefined;
		if (data !== undefined) {
			var t = data.split("&");
			var obj = {};
			$(t).each(function(i,v) {
				var tt = v.split("=");
				obj[tt[0]] = tt[1];
			});
			return obj;
		} else {
			return undefined;
		}
	};

	var loadData = function(data) {
		$.each(data, function(key,value) {
			var $t = $("[name=" + key + "]");
			if ($t.attr("type") === "radio") {
				$.each($t, function(i,v) {
					if ($(this).val() === value) {
						$(this).attr("checked", true);
					}
				});
			} else {
				$("[name=" + key + "]").val(value);
			}
		});
		$("#drinking-souls").slideUp(0);
	};

	var buildDataObject = function(element) {
		var $elem = $(element);
		var fields = $elem.find("select, input");
		var obj = {};
		$(fields).each(function(i, v) {
			if (obj[$(this).attr("name")] === undefined) {
				obj[$(this).attr("name")] = $(this).val();
			}
		});
		return obj;
	};

	var populateResults = function(data) {
		var $results = $("#results");
		var displayRules = [];
		$results.html(" ");

		if (data["player-num"] > 1) {
			if (data["new-player"] === "true" || data["new-player"] === "false") {
				$(rules.newold).each(function(i,v) {
					displayRules.push(v);
				});
			}
			if (data["pvp"] == "true") {
				$(rules.pvp).each(function(i,v) {
					displayRules.push(v);
				});
			}
			if (data["new-player"] === "false") {
				$(rules.advanced).each(function(i,v) {
					displayRules.push(v);
				});
			}
		} else {
			$(rules.solo).each(function(i,v) {
				displayRules.push(v);
			});
		}

		$(displayRules).each(function() {
			$results.append("<li>" + this + "</li>");
		});

		$("#results-list").fadeIn(500);
	};

	var formHandler = function() {
		var $form = $("#drinking-souls");
		$form.on("submit", function(e) {
			e.preventDefault();
			$form.slideUp(500);
			var data = buildDataObject($form);
			saveForm($form.serialize());
			populateResults(data);
		});
		$("#show-hide").on("click", function(e) {
			e.preventDefault();
			if ($form.is(":visible")) {
				$form.slideUp(500);
			} else {
				$form.slideDown(500);
			}
		});
	};

	init = function() {
		formHandler();
		var data = getFormData();
		if (data !== undefined) {
			loadData(data);
			populateResults(data);
		}
	};

}).call(this);