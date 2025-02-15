# JavaScript Injector

Fork of [hex0cter/js-injector](https://github.com/hex0cter/js-injector) with bootstrap, jQuery removed and JS Fixes.

Chrome extension for injecting javascript to the webpage you are visiting. It can be used as a handy tool to make your surfing a bit of more fun.

Useful for automating email address input and redirection for low timeout sites Okta, AWS ..etc.
Opening links in new tab by default news.ycombinator.com.

## Usage

1. Open Y Combinator News Link On New Sites

![alt text](https://raw.githubusercontent.com/saurabh-kushwah/js-injector/master/public/hackernews.png "the snippet will be executed")

2. Hide AutoModerator Comments On Reddit

```javascript
document
    .querySelectorAll('[author="AutoModerator"]')
    .forEach(e => element.remove());
```

## License

This code is free to use under the terms of the MIT license.
