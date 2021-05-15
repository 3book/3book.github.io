/* global hexo */

'use strict';

const { parse } = require('url');

hexo.extend.filter.register('after_post_render', data => {
  const { config } = hexo;
  const theme = hexo.theme.config;
  if (!theme.exturl && !theme.lazyload) return;
  if (theme.lazyload) {
    data.content = data.content.replace(/(<img[^>]*) src=/img, '$1 data-src=');
  }
  if (theme.exturl) {
    const siteHost = parse(config.url).hostname || config.url;
    // External URL icon
    const exturlIcon = theme.exturl_icon ? '<i class="fa fa-external-link-alt"></i>' : '';
    data.content = data.content.replace(/<a[^>]* href="([^"]+)"[^>]*>([^<]+)<\/a>/img, (match, href, html) => {
      // Exit if the href attribute doesn't exists.
      if (!href) return match;

      // Exit if the url has same host with `config.url`, which means it's an internal link.
      const link = parse(href);
      if (!link.protocol || link.hostname === siteHost) return match;

      // Return encrypted URL with title.
      const title = match.match(/title="([^"]+)"/);
      if (title) return `<span class="exturl" data-url="${Buffer.from(href).toString('base64')}" title="${title[1]}">${html}${exturlIcon}</span>`;

      return `<span class="exturl" data-url="${Buffer.from(href).toString('base64')}">${html}${exturlIcon}</span>`;
    });
  }

}, 0);
