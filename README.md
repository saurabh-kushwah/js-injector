# JavaScript Injector

Fork of [hex0cter/js-injector](https://github.com/hex0cter/js-injector) with bootstrap, jQuery removed and JS Fixes.

Chrome extension for injecting javascript to the webpage you are visiting. It can be used as a handy tool to make your surfing a bit of more fun.

Useful for custom changes on how you visit a site like blocking some stuff, automation for clicking button and much more..

Useful for automating email address input and redirection for low timeout sites Okta, AWS ..etc.
Opening links in new tab by default news.ycombinator.com.

Key Features:

1. Supports Pattern Based Injection
2. Multiple Separate Injection For A Site

## Usage

1. Open Y Combinator News Link On New Sites

![alt text](https://raw.githubusercontent.com/saurabh-kushwah/js-injector/master/public/hackernews.png "the snippet will be executed")

2. Hide AutoModerator Comments On Reddit

```javascript
document
    .querySelectorAll('[author="AutoModerator"]')
    .forEach(e => element.remove());
```

## Sample Snippets

### Y Combinator

Open all links in new tab and also allow to toggle collapse the comment section (only first line of that comment).

```js

// open all links in new tab.
document.querySelectorAll('a[href]').forEach(a => {
  a.setAttribute('target', '_blank');
});

// allow to hide the comment chain on clicking
// first line/para of the comment.
function onClickHandler(event) {
    let target = event.target;

    if (
        target.nodeName === "DIV" &&
        target.classList.contains("commtext")
    ) {
        target
            .parentElement
            .parentElement
            .querySelector(".togg.clicky")
            .click();
    }
}

document.onclick = onClickHandler;
```

### WhatsApp

Focus On `favorites` section and remove other sections.

```js
// focus on favorities only
document.getElementById('favorites-filter').click();
// remove all other sections
document.querySelector('div[aria-label="chat-list-filters"]').remove()
```

## License

This code is free to use under the terms of the MIT license.
