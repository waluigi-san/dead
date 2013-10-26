---
layout: article
title: Hello, World!
---
Hello, World!

Hi. My name is Benjamin Tan and this is my personal Github webpage. I'm a front-end web developer who likes to contribute to open source projects, such as [NixTuts](http://nixtuts.info "NixTuts") and the [HTML5 Boilerplate](http://h5bp.com "HTML5 Boilerplate") [server-configs](http://github.com/h5bp/server-configs "server-configs") project. 

This is the first post on my blog, a "Hello World!" post, so here's hi:

{% highlight javascript %}
console.log( "Hello World!" );
{% endhighlight %}

This site is built on loads of open-source software, such as:

- [Jekyll](http://jekyllrb.com)
- [GitHub Pages](http://pages.github.com)
- [HTML5 Boilerplate](http://h5bp.com) (duh!)
- [HTML5Shiv](https://github.com/aFarkas/html5shiv)
- [jQuery](http://jquery.com)
- [Google's](http://google.com) [WebFonts](http://google.com/webfonts)

Jekyll
------
Jekyll is a static site generator with stuff like layouts and file includes. There are five separate layouts for this site on Jekyll:

- default, the base layout
- home, built for the home page
- archives, for the Archives page
- article, for all articles and other pages
- page, for my About page

I'm running this live on Github Pages so any changes I push to git are made live almost immediately. This can be done by creating a repo called "yourusername.github.com" and pushing to it.

HTML5 Boilerplate
-----------------
I'm using the H5BP index.html code, split into two parts, head.html and body.html, and included into another HTML file using Jekyll. I also added various parts of the [HTML5 Mobile Boilerplate](http://mobileboilerplate.com) and merged them into the head.html file. Most of the H5BP CSS has remained intact, with a few "minor" additions, at the [css folder](https://github.com/d10/d10.github.com/tree/master/_includes/css) under [\_includes](https://github.com/d10/d10.github.com/tree/master/_includes). However, I've split up the CSS from 1 file into many.

Modernizr
---------
I'm just using the [html5shiv](https://github.com/aFarkas/html5shiv) with Print Protector to support IE 6-8 for simple styling. However, in IE6-8, the media queries don't work and I might circumvent that using [Respond.js](https://github.com/scottjehl/Respond) eventually.

Fonts
-----
I'm using Helvetica Neue to set all my text, provided by fonts.com.

Disqus
------
[Disqus](http://disqus.com) is being used to support comments on all my articles. I used to have some problems with Disqus appearing on my home page, but those problems have been fixed, and you can use Disqus by going to an actual archive page (with JavaScript turned on).

Source
-------
For all those people intersted in how I created my site, feel free to browse the source of the site is available at [d10.github.com at GitHub](https://github.com/d10/d10.github.com). However, it is recommended that you know the basics of Jekyll first.
