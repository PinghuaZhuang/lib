let inspectMode = false;
let selectorMode = true;
let dropsMode = false;
let dropsDebounce;
let context;
let hex;
let copyTimeout;
let overlayTpl, toolbarTpl;
$.get(
    chrome.extension.getURL("/chrome/inject/inspect-overlay.html"),
    function (overlay) {
        $.get(
            chrome.extension.getURL("/chrome/inject/inspect-toolbar.html"),
            function (toolbar) {
                overlayTpl = overlay;
                toolbarTpl = toolbar;
                chrome.runtime.onMessage.addListener(function (
                    request,
                    sender,
                    sendResponse
                ) {
                    if (request.type == "inspect") {
                        if (request.hasOwnProperty("query")) {
                            chrome.runtime.sendMessage({
                                type: "inspect",
                                checked: inspectMode,
                            });
                        } else {
                            setInspectMode(!inspectMode);
                        }
                    }
                    return Promise.resolve("");
                });
                chrome.storage.onChanged.addListener(function (
                    changes,
                    areaName
                ) {
                    if (areaName == "sync") {
                        setTimeout(parseStyles, 500);
                    }
                });
                parseStyles();
            }
        );
    }
);

function openOverlayScreen() {
    $("amino-overlay-screen").addClass("active");
    setTimeout(function () {
        $("amino-overlay-screen").removeClass("active");
    }, 1500);
}

function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16);
}

function generateDropsContext() {
    if (dropsMode) {
        if (typeof dropsDebounce !== "undefined") {
            clearTimeout(dropsDebounce);
        }
        dropsDebounce = setTimeout(() => {
            chrome.runtime.sendMessage({ type: "drops" }, function (response) {
                const canvas = document.createElement("canvas");
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const base_image = new Image();
                context = canvas.getContext("2d");
                base_image.src = response;
                base_image.onload = function () {
                    context.drawImage(
                        base_image,
                        0,
                        0,
                        window.innerWidth,
                        window.innerHeight
                    );
                };
            });
        }, 300);
    }
}

$("body").on("click", "amino-inspect-toolbar-btn", function (event) {
    event.preventDefault();
    event.stopPropagation();
    setInspectMode(false);
});
$("body").on("click", "amino-inspect-toolbar-list-item.side", function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this)
        .closest("amino-inspect-toolbar")
        .toggleClass("left")
        .toggleClass("right");
    $(this).children().toggleClass("hide");
});
$("body").on(
    "click",
    "amino-inspect-toolbar-list-item.selectors",
    function (event) {
        event.preventDefault();
        event.stopPropagation();
        $("amino-inspect-toolbar-list-item").removeClass("active");
        $(this).addClass("active");
        $(".amino-scan-content.selectors").addClass("hide");
        $(".amino-scan-content.drops").removeClass("hide");
        if (dropsMode) {
            dropsMode = false;
            selectorMode = true;
        }
    }
);
$("body").on(
    "click",
    "amino-inspect-toolbar-list-item.drops",
    function (event) {
        $("amino-inspect-toolbar-list-item").removeClass("active");
        $(this).addClass("active");
        $(".amino-scan-content.selectors").addClass("hide");
        $(".amino-scan-content.drops").removeClass("hide");
        if (!dropsMode) {
            dropsMode = true;
            selectorMode = false;
            generateDropsContext();
        }
    }
);
$("body").on("mouseover", "amino-inspect-toolbar-wrap", function (event) {
    $("amino-inspect-toolbar").addClass("is-active");
    $(".amino-scan-overlay").hide();
});
$("body").on("mouseout", "amino-inspect-toolbar-wrap", function (event) {
    $("amino-inspect-toolbar").removeClass("is-active");
    $(".amino-scan-overlay").show();
});
chrome.runtime.sendMessage({ type: "inspect", checked: inspectMode });
function setInspectMode(bool) {
    inspectMode = bool;
    chrome.runtime.sendMessage({ type: "inspect", checked: inspectMode });
    if (inspectMode === true) {
        if (dropsMode) {
            $(".amino-scan-content.selectors").addClass("hide");
            $(".amino-scan-content.drops").removeClass("hide");
        }
        $(".amino-scan-overlay").css({ display: "block" });
        $("body").addClass("amino-inspect");
        injectOverlayTools(toolbarTpl);
        attachHandlers(overlayTpl);
        setTimeout(function () {
            openOverlayScreen();
        }, 50);
    } else {
        $(".amino-scan-overlay, .amino-inspect-toolbar").remove();
        $("body").removeClass("amino-inspect");
        removeHandlers();
    }
}

function removeHandlers() {
    $(document).off("mouseover");
    $(document).off("mousemove");
    $(document).off("mouseout");
    $(document).off("scroll");
    $(window).off("resize");
}

function attachHandlers(overlayTpl) {
    $(document).on("mouseover", function (event) {
        event.stopPropagation();
        if (
            !$(event.target).hasClass("amino-scan-overlay") &&
            !$.contains($(".amino-inspect-toolbar")[0], $(event.target)[0]) &&
            !$(event.target).hasClass("amino-inspect-toolbar") &&
            selectorMode &&
            !dropsMode
        ) {
            injectOverlay(event, overlayTpl);
            $(event.target).on("click", function (event) {
                event.stopPropagation();
                event.preventDefault();
                copySelector(event.target);
            });
            $(event.target).on("mouseup mousedown", function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
        }
    });
    $(window).on("resize", generateDropsContext);
    $(document).on("scroll", generateDropsContext);
    $(document).on("click", function (event) {
        if (
            !$(event.target).hasClass("amino-scan-overlay") &&
            !$.contains($(".amino-inspect-toolbar")[0], $(event.target)[0]) &&
            !$(event.target).hasClass("amino-inspect-toolbar") &&
            dropsMode
        ) {
            event.preventDefault();
            event.stopPropagation();
            copyTextToClipboard(hex);
        }
    });
    $(document).on("mousemove", function (event) {
        event.stopPropagation();
        if (
            !$(event.target).hasClass("amino-scan-overlay") &&
            !$.contains($(".amino-inspect-toolbar")[0], $(event.target)[0]) &&
            !$(event.target).hasClass("amino-inspect-toolbar") &&
            typeof context !== "undefined" &&
            dropsMode
        ) {
            const p = context.getImageData(
                event.clientX,
                event.clientY,
                1,
                1
            ).data;
            hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
            injectOverlay(event, overlayTpl.replace("{{ dropsHex }}", hex));
            $(".amino-scan-content.selectors").toggleClass("hide");
            $(".amino-scan-content.drops").toggleClass("hide");
            $("amino-drops-color-box").css({ backgroundColor: hex });
        }
        repositionOverlay(event);
    });
    $(document).on("mouseout", function (event) {
        $(event.target).removeClass("amino-overlay-active");
        $(event.target).off("click");
        $(event.target).off("mouseup");
        $(event.target).off("mousedown");
    });
}

function injectOverlayTools(tpl) {
    $("body").append($(tpl));
}

function injectOverlay(event, tpl) {
    resetCopyText();
    let el = $(event.target);
    let css_text = "/* No styles... */";
    if (el[0].hasAttribute("amino-styles")) {
        const seen = [];
        const rules = el.attr("amino-styles").split(";").reverse();
        const cleanRules = [];
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i].split(":").shift().trim();
            if (seen.indexOf(rule) == -1 && rule !== "") {
                seen.push(rule);
                cleanRules.push(rules[i].trim());
            }
        }
        css_text = cleanRules.sort().join(";\n") + ";";
    }
    const overlay = $(tpl.replace("{{ cssSelector }}", getSelector(el)));
    if (css_text === "/* No styles... */") {
        overlay.find(".custom-styles").hide();
    }
    $(".amino-scan-overlay").remove();
    $("body").append(overlay);
    const [x, y] = getElementPosition(event);
    $(".amino-scan-overlay").css({
        left: x,
        top: y,
    });
    if (!inspectMode) {
        $(".amino-scan-overlay").css({ display: "none" });
    } else if (!dropsMode) {
        $(event.target).addClass("amino-overlay-active");
    }
}

function getElementPosition(event) {
    const padding = 20;

    const $overlay = $(".amino-scan-overlay");

    const overlayWidth = $overlay.width() + 25;
    const overlayHeight = $overlay.height() + 30;

    const screenWidth = $(window).width();
    const screenHeight = $(window).height();

    let x = event.clientX;
    let y = event.clientY;

    if (x >= screenWidth - padding - overlayWidth) {
        x = x - overlayWidth - padding;
    } else {
        x = x + padding;
    }

    if (y >= screenHeight - padding - overlayHeight) {
        y = y - overlayHeight - padding;
    } else {
        y = y + padding;
    }

    return [x, y];
}

function repositionOverlay(event) {
    const [x, y] = getElementPosition(event);
    $(".amino-scan-overlay").css({
        left: x,
        top: y,
    });
}

function loadStylesheet(url) {
    return $.get(url).fail((error) => {
        console.log("CSS Parse Error:", error);
    });
}

function parseStyles() {
    const styles = [];
    return Promise.resolve()
        .then(() => {
            return document.querySelectorAll("style.amino");
        })
        .then((elements) => {
            const sheets = [];
            for (let i = 0; i < elements.length; i++) {
                if (elements[i].localName == "style") {
                    styles.push(elements[i]);
                } else if (elements[i].href.endsWith(".css")) {
                    sheets.push({ order: i, url: elements[i].href });
                }
            }
            return styles;
        })
        .then((styles) => {
            $("*").removeAttr("amino-styles");
            const ruleRegExp =
                /([a-zA-Z0-9.\-_:,\s#]*)\s{([a-zA-Z0-9.\-_:\,\s;\!#\)\(]*)}/gm;
            for (let style of styles) {
                let match;
                while ((match = ruleRegExp.exec(style.innerText)) !== null) {
                    if (!match[1].match("::")) {
                        $(match[1].trim()).attr(
                            "amino-styles",
                            ($(match[1].trim()).attr("amino-styles") || "") +
                                match[2].trim().replace(/ +(?= )/g, "")
                        );
                    }
                }
            }
        });
}

function copyTextToClipboard(text) {
    const copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand("copy");
    body.removeChild(copyFrom);
    resetCopyText();
    //$('.amino-scan-overlay').children().toggleClass('hide');
    //copyTimeout = setTimeout(function () {
    //	$('.amino-scan-overlay').children().toggleClass('hide');
    //}, 1500);
    $("amino-overlay-screen span").text("Copied to clipboard");
    openOverlayScreen();
}

function resetCopyText() {
    clearTimeout(copyTimeout);
    $(".amino-scan-overlay")
        .find(".click-to-copy")
        .children()
        .each(function (key) {
            if (key === 0) {
                $(this).removeClass("hide");
            } else {
                $(this).addClass("hide");
            }
        });
}

function copySelector(el) {
    copyTextToClipboard(getSelector(el));
}
